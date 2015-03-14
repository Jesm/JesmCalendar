window.jesmCalendarEls=[];
function botaZero(a){
	return ("0"+a).slice(-2);
}

function jesmCalendar(el, ate, partindo, tipo, posi, emRelacao, clickOut){
	window.jesmCalendarEls.push(el);
	var indice=window.jesmCalendarEls.length-1,
	
	abc=document.createElement("div");
	abc.innerHTML='<h1 unselectable="on"><span class="left">&#9664;</span><span class="title"></span><span class="right">&#9654;</span></h1><div class="tables"><ul class="meses"></ul></div><a href="javascript:void(0);" class="fechar_close">Fechar calendário</a>';
	abc.className="jesmCalendarEl";
	abc.style.opacity='0';
	(emRelacao||document.body).appendChild(jesm(abc));
	
	var dataInicial=(function(a){
		if(a==null)
			return [(new Date).getDate(), (new Date).getMonth(), (new Date).getFullYear()];
		a=a.split("/");
		a[1]=Number(a[1])-1;
		if(a[2].length==2)
			a[2]="20"+a[2];
		return a;
	})(partindo);
	
	
	el.jesmCalendar={
		formato:"dd/mm/yyyy",
		meses:["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		dias:["D", "2ª", "3ª", "4ª", "5ª", "6ª", "S"],
		divisor:"/",
		
		elemento:abc,
		
		tipo:tipo||"blockOld",
		ate:(ate?(function(a){
				a=a.split("/");
				a[0]=Number(a[0])-1;
				if(a[1].length==2)
					a[1]="20"+a[1];
				return a;
			})(ate):null),
		partindo:dataInicial,
		depois:null,
		sit:0,
		proxSit:[-1, 1],
		lastData:dataInicial.slice(1, 3),
		//colors_dias:(function(){var t=[];for()})(),
		lado:10,		
		
		addMes:function(a){			
			var limite_mes=(function(data){
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
				switch(a){
					case "blockOld":
						return function(dia_decidir, mes_ano_atual, data_inicial){
							return dia_decidir<data_inicial[0]&&mes_ano_atual[0]<=data_inicial[1]&&mes_ano_atual[1]<=data_inicial[2];
						};
					case "blockNew":
						return function(dia_decidir, mes_ano_atual, data_inicial){
							return dia_decidir>data_inicial[0]&&mes_ano_atual[0]>=data_inicial[1]&&mes_ano_atual[1]>=data_inicial[2];
						};
					case "noBlock":
						return function(){
							return !1;
						};
				}
			})(this.tipo),
			
			dia_semana=(function diaSemana(mes, ano){
				return Number(new Date(ano, mes-1, 1).getDay());
			})(this.lastData[0]+1, this.lastData[1]);
			
			var temp="<li"+(a=="back"?" style='margin-left:"+(this.sit*250)+"px;'":'')+"><table><tr><th>"+this.dias.join("</th><th>")+"</th></tr><tr>";
			
			for(var x=0;x++<dia_semana;temp+="<td class='invalid'></td>");
			
			for(var x=0, dia=this.partindo[0];++x<=limite_mes;dia_semana++){
				if(dia_semana==7){
					temp+="</tr><tr>";
					dia_semana=0;
				}
				temp+="<td "+(decisao(x, this.lastData, this.partindo)?"class='invalid'":"onclick='window.jesmCalendarEls["+indice+"].jesmCalendar.retorna("+x+", "+this.lastData[0]+", "+this.lastData[1]+");'")+">"+x+"</td>";
			}
			
						
			for(;7-dia_semana;dia_semana++, temp+="<td class='invalid'></td>");
			
			a=="back"?this.animaCal.elemento.innerHTML=temp+"</tr></table></li>"+this.animaCal.elemento.innerHTML:this.animaCal.elemento.innerHTML+=temp+"</tr></table></li>";
			this.animaCal.elemento.style.width=this.animaCal.elemento.pega("<>", "li").length*250+"px";
		},
		mover:function(d){
			switch(d){
				case 'l':
					if(--this.lastData[0]==-1){
						this.lastData[0]=11;
						this.lastData[1]--;
					}
					if(--this.sit==this.proxSit[0]){
						this.addMes("back");
						this.proxSit[0]--;
					}
				break;
				case 'r':
					if(++this.lastData[0]==12){
						this.lastData[0]=0;
						this.lastData[1]++;
					}
					if(++this.sit==this.proxSit[1]){
						this.addMes("forward");
						this.proxSit[1]++;
					}
				break;
			}
			
			this.setaL.style.visibility=(!this.sit&&this.tipo=="blockOld")?"hidden":"visible";
			this.setaR.style.visibility=((!this.sit&&this.tipo=="blockNew")||(this.ate!=null&&this.ate[0]==this.lastData[0]&&this.ate[1]==this.lastData[1]&&this.tipo=="blockOld"))?"hidden":"visible";
			
			this.titulo.innerHTML=el.jesmCalendar.meses[this.lastData[0]]+el.jesmCalendar.divisor+el.jesmCalendar.lastData[1];
			this.animaCal.go(.3, this.sit*-250);
										
		},
		
		retorna:function(dia, mes, anos){
			var formato=this.formato.split('/');			
			el.value=botaZero(dia)+"/"+botaZero(mes+1)+"/"+(formato[2].length>2?anos:botaZero(anos));
			this.fechar();
			if(this.depois)
				this.depois();
		},
		fechar:function(){
			this.anima.addDepois(function(){this.elemento.style.display="none";}).go(.1, 0);
		}
	}
	
	var config=el.jesmCalendar;
		
	config.anima=new anima(el.jesmCalendar.elemento, "opacity");
	config.animaCal=new anima(el.jesmCalendar.elemento.pega('.', "meses", 0), "margin-left");
		
	config.titulo=el.jesmCalendar.elemento.pega('.', "title", 0);
	config.setaL=el.jesmCalendar.elemento.pega('.', "left", 0);
	config.setaR=el.jesmCalendar.elemento.pega('.', "right", 0);
	el.jesmCalendar.elemento.pega('.', "fechar_close", 0).onclick=function(){
		el.jesmCalendar.fechar();
	};
	if(clickOut){
		addEvento(window, "click", function(){el.jesmCalendar.fechar()});
		addEvento(el.jesmCalendar.elemento, "click", function(e){
			var ev=e||window.event;
			ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
		});
	}
	
	switch(el.jesmCalendar.tipo){
		case "blockOld": config.setaL.style.visibility="hidden";
		break;
		case "blockNew": config.setaR.style.visibility="hidden";
		break;
	}
	
	addEvento(config.setaL, "click", function(){
		config.mover("l");
	});
	addEvento(config.setaR, "click", function(){
		config.mover("r");
	});
	
	config.titulo.innerHTML=el.jesmCalendar.meses[el.jesmCalendar.lastData[0]]+el.jesmCalendar.divisor+el.jesmCalendar.lastData[1];
	config.addMes();
			
	addEvento(el, "focus", function(){
		var config=el.jesmCalendar,
		calendario=config.elemento,
		lista=config.animaCal.elemento;
		
		calendario.style.display="block";
		
		var dimTela=obCross("dimTela")[0], disEl=findPos(el, null), dimEl=obCross("dimEl",el);
		
		if(dimTela-disEl[0]-dimEl[0]>250){
			calendario.style.left=disEl[0]+dimEl[0]+config.lado+"px";
			calendario.style.top=obCross("disEl",el)[1]+"px";
		}
		else{
			var temp=(dimEl[0]<=250)?dimEl[0]-250:0;
			calendario.style.left=obCross("disEl",el)[0]+temp+"px";
			calendario.style.top=disEl[1]+dimEl[1]+config.lado+"px";
		}
		
		jesmDrag(calendario, config.titulo, posi);
		
		addEvento(config.titulo, "mousedown", function(){
			config.anima.addDepois().go(.25, .7);
		});
		addEvento(document, "mouseup", function(){
			config.anima.addDepois().go(.25, 1);
		});	
		config.anima.addDepois().go(.4, 1);	
	});
}

window.jesmCore={};

window.jesmCore.drag={
	ativo:false,
	move:false,
	c:[],
	limites:[],
	pos:[],
	validation:function(){
		return 3;
	}
};

function jesmDrag(el, from, pos){	
	css(el, "position:"+(pos||"absolute"));
	

//////////////////////////////////////////////////////////////////////////////

window.Modernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(l.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e}),m.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:s(["@media (",l.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c};for(var A in m)u(m,A)&&(r=A.toLowerCase(),e[r]=m[A](),p.push((e[r]?"":"no-")+r));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)u(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},v(""),h=j=null,e._version=d,e._prefixes=l,e.testStyles=s,e}(this,this.document);

//////////////////////////////////////////////////////////////	
	if(!window.jesmCore.drag.ativo){
		window.jesmCore.drag.ativo=true;
					
		addEvento(document, window.Modernizr.touch?"touchmove":"mousemove", function(e){
			if(window.jesmCore.drag.move){
				var ev=e||window.event;
				window.jesmCore.drag.pos=[ev.clientX||ev.touches[0].pageX, ev.clientY||ev.touches[0].pageY];
			}
		});
		
		addEvento(document, window.Modernizr.touch?"touchend":"mouseup", function(){
			window.jesmCore.drag.move=false;
			jesmAnimator.delTarefaByObj(window.jesmCore.drag);
		});
	}
	
	
	if(!el.jesmDrag){
		el.jesmDrag=true;
		
		css(from||el, "webkitUserSelect:none;MozUserSelect:none;msUserSelect:none;oUserSelect:none;userSelect:none");
		(from||el).setAttribute("unselectable", "on"); // For IE and Opera
		
		addEvento(from||el, window.Modernizr.touch?"touchstart":"mousedown", function(e){
			(function(ev){
				ev.preventDefault?ev.preventDefault():ev.returnValue=false;						
				var dr=window.jesmCore.drag, temp=findPos(el);
				dr.move=el;
				dr.c=[temp[0]-(ev.clientX||ev.touches[0].pageX), temp[1]-(ev.clientY||ev.touches[0].pageY)];
				dr.pos=[ev.clientX||ev.touches[0].pageX, ev.clientY||ev.touches[0].pageY];
				
				jesmAnimator.addTarefa(
					function(){
						var drag=window.jesmCore.drag, flag=drag.validation();
						css(drag.move,
							((flag!=0||flag==1)?"left:"+(drag.pos[0]+drag.c[0])+"px;":'')+
							((flag!=0||flag==2)?"top:"+(drag.pos[1]+drag.c[1])+"px":'')
						);
					}
				, dr);			
			})(e||window.event);
		});
	}
}