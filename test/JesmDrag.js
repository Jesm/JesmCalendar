Jesm.Drag=function(el, from, ctxtEl){
	this.ativo=true;	
	this.data={};
	this.drops=[];
	
	this.pos=[];
	this.disClick=[];
	this.round=false;
	this.dropEmbaixo=null;
	this.cssRule=['left', 'top'];
	
	this.el=Jesm.pega(el);
	this.from=from||el;
	this.fixed=Jesm.Cross.getStyle(el, 'position')=='fixed';
	/*
		EVENTOS QUE PODEM SER COLOCADOS:
		this.onDragStart;
		this.onDragHover;
		this.onDrop;
		this.onSucessDrop;
		this.onFailDrop;
	*/
	
	this.clicar=function(ev){
		var disEl=Jesm.Cross.offset(this.el, null, true), mouse=Jesm.Cross.getMouse(ev);
		
		for(var x=2;x--;this.disClick[x]=mouse[x]-disEl[x]);
		for(var x=this.drops.length;x--;)
			if(this.drops[x].onDragSelect)
				this.drops[x].onDragSelect();
		Jesm.Core.drag.add(this, ev);
		this.setCursor('grabbing');
		if(this.onDragStart)
			this.onDragStart();
	};
	
	this.setCoord=function(posFinal){
		if(this.ativo){
			var r=[0, 0];
			if(ctxtEl)
				r=Jesm.Cross.offset(ctxtEl, null, true);
			else if(!this.fixed)
				for(var pof=Jesm.Cross.pageOffset(), x=2;x--;r[x]-=pof[x]);
			for(var x=2;x--;){
				r[x]+=this.disClick[x];
				posFinal[x]-=r[x];
			}
			
			this.pos=this.validar(posFinal);
			Jesm.css(this.el, this.cssRule[0]+':'+this.pos.join('px;'+this.cssRule[1]+':')+'px');
			
			if(this.dropEmbaixo&&!Jesm.Core.drag.mouseOverDrop(this.dropEmbaixo))
				this.dropEmbaixo=null;
			if(!this.dropEmbaixo){
				for(var x=this.drops.length;x--;)
					if(Jesm.Core.drag.mouseOverDrop(this.drops[x])){
						this.dropEmbaixo=this.drops[x];
						if(this.dropEmbaixo.onHover)
							this.dropEmbaixo.onHover();
					}
			}
		}
		return this;
	};
	
	this.validar=function(a){
		return a;
	};
	
	this.drop=function(){
		this.setCursor("grab");
		var prop=this.dropEmbaixo?"onSucessDrop":"onFailDrop";
		if(this[prop])
			this[prop]();
		if(this.onDrop)
			this.onDrop();
	};
	
	this.addDrop=function(drop){
		this.drops.push(drop);
	};
	this.delDrop=function(drop){
		for(var x=this.drops.length;x--;)
			if(this.drops[x]==drop)
				this.drops.splice(x, 1);
	};
	this.overDrop=function(drop){
		var cross=Jesm.Cross,
		disDrag=cross.offset(this.el, null, true),
		sizeDrag=cross.offsetSize(this.el),
		disDrop=cross.offset(drop.el, null, true),
		sizeDrop=cross.offsetSize(drop.el);
		for(var x=2;x--;){
			var distancia=disDrag[x]-disDrop[x];
			if(distancia>=sizeDrop[x]||distancia<=-sizeDrag[x])
				return false;
		}
		return true;
	};
	
	
	this.setCursor=function(a){
            if(this.cursorAtual)
                this.from.classList.remove(this.cursorAtual);
            this.from.classList.add(this.cursorAtual=a);
	};
	
	Jesm.css(this.from, "webkitUserSelect:none;MozUserSelect:none;msUserSelect:none;userSelect:none").setAttribute("unselectable", "on");// For IE and Opera
	this.setCursor("grab");
	Jesm.addEvento(this.from, "mousedown,touchstart", function(e){
		var el=e.target;
		while(el!=this.from){
			if(el==document.body)
				return;
			el=el.parentNode;
		}
		this.clicar(e);
		e.preventDefault();
		if(Jesm.isTouchEvent(e))
			e.stopPropagation();
	}, this);
}

Jesm.Drop=function(el){
	this.el=el;
	this.round=false;
	this.onDroped=this.onHover=this.onDragSelect=null;
}

Jesm.Core.drag={
	drags:[],
	storeEvents:{},
	
	add:function(d, ev){
		this.drags.push(d);
		if(this.drags.length==1){
			this.coords=Jesm.Cross.getMouse(ev);
			this.comecar();
		}
		return this;
	},
	comecar:function(){
		var b=document.body;
				
		this.storeEvents.move=Jesm.addEvento(b, "mousemove,touchmove", function(e){
			this.coords=Jesm.Cross.getMouse(e);
			if(Jesm.isTouchEvent(e))
				e.stopPropagation();
		}, this, true);
		
		this.storeEvents.up=Jesm.addEvento(b, "mouseup,touchend", function(e){
			this.drop();
			if(Jesm.isTouchEvent(e))
				e.stopPropagation();
		}, this, true);
		
		var docEl=document.documentElement;
		this.storeEvents.out=Jesm.addEvento(docEl, "mouseout", function(e){
			if(e.target==docEl)
				this.drop();
		}, this, true);
		
		this.iterate();
		Jesm.Core.animator.addTarefa(this.iterate, this);
	},
	iterate:function(){
		for(var x=this.drags.length;x--;this.drags[x].setCoord(this.coords.slice()));
	},
	drop:function(){
		for(var x=this.drags.length;x--;this.del(x));
	},
	del:function(ind){
		this.drags.splice(ind, 1)[0].drop();
		if(!this.drags.length){			
			for(var strs=['move', 'up', 'out'], len=strs.length;len--;Jesm.delEvento(this.storeEvents[strs[len]]));
			Jesm.Core.animator.delTarefaByObj(this);
		}
		return this;
	},
	mouseOverDrop:function(drop){
		var disDrop=Jesm.Cross.offset(drop.el), sizeDrop=Jesm.Cross.offsetSize(drop.el);
		for(var x=2;x--;){
			var metSize=sizeDrop[x]/2;
			if(Math.abs(this.coords[x]-(disDrop[x]+metSize))>metSize)
				return false;
		}
		return true;
	}
};