jesmCore.calendars=[];

function jesmCalendar(el, ate, partindo, tipo, posi, emRelacao, clickOut){
	this.el=document.createElement("div");
	this.el.className="jesmCalendarEl";
	css(this.el, "opacity:0").innerHTML='<h1><span class="left">&#9664;</span><span class="title"></span><span class="right">&#9654;</span></h1><div class="tables"><ul class="meses"></ul></div><a href="javascript:void(0);" class="fechar_close">Fechar calendário</a>';
	;
	(emRelacao||document.body).appendChild(pega(this.el));
	
	var THIS=this,
	botaZero=function(a){
		return ("0"+a).slice(-2);
	},
	dataArray=function(a){
		if(!a)
			return null;
		a=a.split("/");
		a[1]=parseInt(a[1], 10)-1;
		if(a[2].length==2)
			a[2]="20"+a[2];
		return a;
	},
	criaEl=function(tag, classe, txt){
		var el=document.createElement(tag);
		if(classe)
			el.className=classe;
		if(txt!=null)
			el.appendChild(document.createTextNode(txt));
		return el;
	};
	
	this.input=el;
	this.formato="dd/mm/yyyy";
	this.meses="Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro".split(',');
	this.dias="D,2ª,3ª,4ª,5ª,6ª,S".split(',');
	this.divisor='/';
	this.tipo=tipo||"blockOld";
	this.ate=dataArray(ate);
	this.partindo=dataArray(partindo)||(function(t){
		return [t.getDate(), t.getMonth(), t.getFullYear()];
	})(new Date);
	this.depois=null;
	this.sit=0;
	this.proxSit=[-1, 1];
	this.lastData=this.partindo.slice(1, 3);
	// colocar código para tamanho da altura/largura li!!
	
	this.opacity=new anima(this.el, "opacity");
	this.animaCal=new anima(this.el.pega(".meses", 0), "margin-left");		
	this.titulo=this.el.pega(".title", 0);
	this.setaL=this.el.pega(".left", 0);
	this.setaR=this.el.pega(".right", 0);
	this.el.pega(".fechar_close", 0).onclick=function(){
		THIS.fechar();
	};
		
	this.addMes=function(a){			
		var THIS=this,
		
		limiteMes=(function(data){
			switch(data[0]){
				case 3: case 5: case 8: case 10:
					return 30;
				case 1:
					return !(data[1]%400)||(!(data[1]%4)&&data[1]%100)?29:28;
				default:
					return 31;
			}
		})(this.lastData),
		
		decisao=(function(a){
			var mesAnoAtual=THIS.lastData, dataInicial=THIS.partindo;
			switch(a){
				case "blockOld":
					return function(diaDecidir){
						return diaDecidir<dataInicial[0]&&mesAnoAtual[0]<=dataInicial[1]&&mesAnoAtual[1]<=dataInicial[2];
					};
				case "blockNew":
					return function(diaDecidir){
						return diaDecidir>dataInicial[0]&&mesAnoAtual[0]>=dataInicial[1]&&mesAnoAtual[1]>=dataInicial[2];
					};
				case "noBlock":
					return function(){
						return false;
					};
			}
		})(this.tipo),
		
		diaSemana=parseInt(new Date(this.lastData[1], this.lastData[0], 1).getDay(), 10);
		
		var frag=document.createDocumentFragment(),
		li=frag.appendChild(document.createElement("li")),
		table=li.appendChild(document.createElement("table"));
		if(a)
			css(li, "marginLeft:"+this.sit*250+"px");
			
		var tr=table.appendChild(criaEl("tr"));
		cada(this.dias, function(str){
			tr.appendChild(criaEl("th", null, str));
		});
		
		tr=table.appendChild(criaEl("tr"));		
		for(var x=0;x++<diaSemana;tr.appendChild(criaEl("td", "invalid")));
		
		for(var x=0, dia=this.partindo[0];++x<=limiteMes;diaSemana++){
			if(diaSemana==7){
				tr=table.appendChild(criaEl("tr"));
				diaSemana=0;
			}
			var td=tr.appendChild(criaEl("td", null, x));
			if(!decisao(x)){
				td.info=[x, this.lastData[0], this.lastData[1]];
				td.onclick=function(){
					THIS.retorna(this.info[0], this.info[1], this.info[2]);
				}
			}
			else
				td.className="invalid";
		}
		
		for(;7-diaSemana;diaSemana++,tr.appendChild(criaEl("td", "invalid")));
		
		var ul=css(this.animaCal.elemento, "width:"+(this.proxSit[1]-this.proxSit[0]-1)*250+"px");
		a?ul.insertBefore(frag, ul.childNodes[0]):ul.appendChild(frag);		
		return this;
	};
	
	this.mover=function(d){
		var num=d=='l'?-1:1;
		this.lastData[0]+=num;
		this.sit+=num;
		
		if(this.lastData[0]==-1){			
			this.lastData[0]=11;
			this.lastData[1]--;
		}
		else if(this.lastData[0]==12){
			this.lastData[0]=0;
			this.lastData[1]++;
		}
		
		var temp=noArray(this.proxSit, this.sit);
		if(temp!=-1){
			this.proxSit[temp]+=num;
			this.addMes(num==-1);
		}
		
		css(this.setaL, "visibility:"+(!this.sit&&this.tipo=="blockOld"?"hidden":"visible"));
		css(this.setaR, "visibility:"+((!this.sit&&this.tipo=="blockNew")||(this.ate&&this.ate[0]==this.lastData[0]&&this.ate[1]==this.lastData[1]&&this.tipo=="blockOld"))?"hidden":"visible");
		
		this.atualizarMes();
		this.animaCal.go(.3, [this.sit*-250]);
		
		return this;									
	};
	this.retorna=function(dia, mes, anos){
		var formato=this.formato.split('/');			
		this.input.value=botaZero(dia)+"/"+botaZero(mes+1)+"/"+(formato[2].length>2?anos:botaZero(anos));
		this.fechar();
		if(this.depois)
			this.depois();
	};
	this.abrir=function(X, Y){
		
	};
	this.fechar=function(){
		this.opacity.go(.1, [0], function(a){
			css(a.elemento, "display:none");
		});
	};
	this.atualizarMes=function(){
		this.titulo.innerHTML=this.meses[this.lastData[0]]+this.divisor+this.lastData[1];
	};
	
	if(clickOut){
		addEvento(document.body, "click", function(){
			THIS.fechar();
		});
		addEvento(this.el, "click", function(e){
			obCross.stopPropagation(e||window.event);
		});
	}
	
	switch(this.tipo){
		case "blockOld": css(this.setaL, "visibility:hidden");
		break;
		case "blockNew": css(this.setaR, "visibility:hidden");
		break;
	}
	
	addEvento(this.setaL, "click", function(){
		THIS.mover("l");
	});
	addEvento(this.setaR, "click", function(){
		THIS.mover("r");
	});
		
	addEvento(THIS.titulo, "mousedown", function(){
		THIS.opacity.go(.25, [.7]);
	});
	addEvento(document.body, "mouseup", function(){
		THIS.opacity.go(.25, [1]);
	});	
	
	// INICIO DAS CONFIGURAÇÕES
	this.atualizarMes();
	this.addMes();
			
	addEvento(this.input, "focus", function(){
		var calendario=THIS.el, lista=THIS.animaCal.elemento,
		dimTela=obCross.inner()[0], disEl=obCross.disEl(THIS.input), dimEl=obCross.client(THIS.input),
		left, top;
		
		if(dimTela-disEl[0]-dimEl[0]>250){
			left=disEl[0]+dimEl[0]+10;
			top=disEl[1];
		}
		else{
			var temp=(dimEl[0]<=250)?dimEl[0]-250:0;
			left=disEl[0]+temp;
			top=disEl[1]+dimEl[1]+10;
		}
		
		css(calendario, "display:block;left:"+left+"px;top:"+top+"px");
		jesmCore.drag.go(calendario, THIS.titulo, posi);
		THIS.opacity.go(.4, [1]);	
	});
	
	jesmCore.calendars.push(this);
	return this;
}

function jesmCalendarInput(){
}

jesmCore.drag={
	ativo:false,
	move:null,
	c:[],
	limites:[],
	pos:[],
	validation:function(){
		return 3;
	},
	go:function(el, from, pos){
		css(el, "position:"+(pos||"absolute"));
		var THIS=this, b=document.body;
		if(!this.ativo){
			this.ativo=true;
			cada(["touchmove", "mousemove"], function(str, ind){
					addEvento(b, str, function(e){
					if(!THIS.move)
						return;
					var ev=e||window.event;
					THIS.pos=[ev.clientX||ev.touches[0].pageX, ev.clientY||ev.touches[0].pageY];
					if(!ind)
						obCross.stopPropagation(ev);
				});
			});
			cada(["touchend", "mouseup"], function(str, ind){
				addEvento(b, str, function(e){
					var ev=e||window.event;
					THIS.move=null;
					jesmCore.animator.delTarefaByObj(THIS);
					if(!ind)
						obCross.stopPropagation(ev);
				});
			});		
		}
		
		if(!el.jesmDrag){
			el.jesmDrag=true;
			css(from||el, "webkitUserSelect:none;MozUserSelect:none;msUserSelect:none;oUserSelect:none;userSelect:none").setAttribute("unselectable", "on"); // For IE and Opera
			cada(["touchstart", "mousedown"], function(str, ind){
				addEvento(from||el, str, function(e){
					var ev=e||window.event, temp=obCross.disEl(el);
					obCross.preventDefault(ev);
					THIS.move=el;
					THIS.c=[temp[0]-(ev.clientX||ev.touches[0].pageX), temp[1]-(ev.clientY||ev.touches[0].pageY)];
					THIS.pos=[ev.clientX||ev.touches[0].pageX, ev.clientY||ev.touches[0].pageY];
					
					jesmCore.animator.addTarefa(function(){
						var flag=THIS.validation();
						css(THIS.move,
							((flag!=0||flag==1)?"left:"+(THIS.pos[0]+THIS.c[0])+"px;":'')+
							((flag!=0||flag==2)?"top:"+(THIS.pos[1]+THIS.c[1])+"px":'')
						);
					}, THIS);
					if(!ind)
						obCross.stopPropagation(ev);
				});
			});
		}
	}
};