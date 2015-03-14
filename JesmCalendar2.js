Jesm.Calendar=function(config){
	
	this.andarMes=function(data, num){
		var nova=data.slice();
		for(var um=num>0?1:-1;num;num+=um*-1){
			nova[1]+=um;	
			if(Jesm.Cross.indexOf([-1, 12], nova[1])>-1){			
				nova[1]=(nova[1]+12)%12;
				nova[0]+=um;
			}
		}
		return nova;
	};
	
	this.toDate=function(d){
		return new Date(d[0], d[1], d[2]||1, 0, 0, 0, 0);
	};
	
	this.toArray=function(d){
		return [d.getFullYear(), d.getMonth()];
	};
	
	this.compararDatas=function(d1, d2){
		if(d1[0]==d2[0]&&d1[1]==d2[1])
			return 0;
		else
			return (d1[0]<d2[0]||(d1[0]==d2[0]&&d1[1]<d2[1]))?1:-1;
	};
	
	this.diferencaData=function(d){
		d=this.toArray(d);
		var ret=0;
		for(var x=0, ma=this.func.mesAtual, cmp;x<2;x++){
			cmp=this.compararDatas(d, ma);
			while(d[x]!=ma[x]){
				ret+=(x?1:12)*cmp;
				d[x]+=cmp;
			}
		}
		return ret;
	};
	
	this.formatar=function(str, d){
		var temp={d:'Date',m:'Month',Y:'FullYear'};
		for(var p in temp){
			var valor=d['get'+temp[p]]();
			if(p=='m')
				valor++;
			if(valor<10)
				valor='0'+valor;
			str=str.replace(p, valor);
		}
		return str;
	};
		
	function limparData(d){
		for(var strs=['Hours', 'Minutes', 'Seconds', 'Milliseconds'], x=strs.length;x--;d['set'+strs[x]](0));
		return d;
	};
	
	this.mover=function(num){
		var indo=num>0, um=indo?1:-1, mesVeio=this.func.mesAtual;
		this.openFrag(indo);
		for(;num;num+=um*-1){
			if(indo){
				var objMes=this.getMes();
				this.func.offset+=objMes.linhas-+objMes.colide[1];
			}
			this.func.mesAtual=this.andarMes(this.func.mesAtual, um);
			var pos=Jesm.Cross.indexOf(this.func.proxSit, this.func.sit+=um);
			if(pos>-1){
				this.func.proxSit[pos]+=um;
				this.addMes(indo);
				var objMes=this.getMes().verificar();
				this.getMes(this.andarMes(this.func.mesAtual, um)).verificar();
				if(!indo)
					this.func.top+=objMes.linhas-+objMes.colide[1];
			}
			if(!indo){
				var objMes=this.getMes();
				this.func.offset-=objMes.linhas-+objMes.colide[1];
			}
		}
		this.closeFrag();
		this.getMes(mesVeio).alterarDias(function(){
			this.setAtual(false);
		});
		this.getMes().alterarDias(function(){
			this.setAtual(true);
		});
		
		this.updateMedidas().verificarSetas().atualizarMes();
	};

	this.addMes=function(indo){
		var objMesAtual=this.getMes(),
		totalDias=objMesAtual.diasNoMes,
		diaSemana=objMesAtual.diaSemana,
		frag=document.createDocumentFragment(),
		tr=Jesm.el('tr', null, frag);
		
		// faz os dias do mes anterior
		var objMes=this.getMes(this.andarMes(this.func.mesAtual, -1)), numDias=objMes.diasNoMes;
		if(!(indo&&this.func.pronto)&&diaSemana){
			for(var dia=numDias-diaSemana;++dia<=numDias;objMes.addDia(dia, tr));
			objMesAtual.colide[0]=objMes.colide[1]=true;
			objMes.linhas=1;
		}
		
		// faz os dias do mes atual
		var dia=1;
		if(indo&&this.func.pronto&&diaSemana){
			dia+=7-diaSemana;
			diaSemana=0;
			objMesAtual.linhas=1;
		}
		for(var faltam=totalDias-dia+1;faltam>=7||diaSemana;faltam--, diaSemana=(diaSemana+1)%7, dia++){
			objMesAtual.addDia(dia, tr);
			if(diaSemana==6){
				objMesAtual.linhas++;
				if(faltam)
					tr=Jesm.el('tr', null, frag);
			}
		}
		
		// faz os dias do proximo mes
		var objMes=this.getMes(this.andarMes(this.func.mesAtual, 1));
		if(indo&&dia<=totalDias){
			while(dia<=totalDias){
				objMesAtual.addDia(dia++, tr);
				diaSemana++;
			}
			for(dia=1;diaSemana++<7;objMes.addDia(dia++, tr));
			objMesAtual.linhas++;
			objMes.linhas++;
			objMesAtual.colide[1]=objMes.colide[0]=true;
		}
		
		this.els.frag.insertBefore(frag, indo?null:this.els.frag.firstChild);
	};
	
	this.getMes=function(d){
		var THIS=this, anos=this.func.anos;
		d=d||this.func.mesAtual;
		if(!anos[d[0]])
			anos[d[0]]=[];
		if(!anos[d[0]][d[1]]){
			var novoMes={
				lista:[],
				linhas:0,
				colide:[false, false],
				verificar:function(){
					var fun, at=[true, true];
					for(var strs=['Passado', 'Futuro'], x=strs.length;x--;){
						var timeLimite=THIS.cfg['limite'+strs[x]];
						if(!timeLimite)
							continue;
						var arrLimite=THIS.toArray(timeLimite), cmp=THIS.compararDatas(arrLimite, d);
						if(!cmp){
							fun=function(){
								var timeTemp=THIS.toDate(this.data).getTime(), cmp1=true, cmp2=true;
								if(THIS.cfg.limitePassado)
									cmp1=timeTemp>=THIS.cfg.limitePassado.getTime();
								if(THIS.cfg.limiteFuturo)
									cmp2=timeTemp<=THIS.cfg.limiteFuturo.getTime();
								this.setAtivo(cmp1&&cmp2);
							};
							break;
						}
						else
							at[x]=cmp!=(x?1:-1);
					}
					if(!fun){
						fun=function(){
							this.setAtivo(at[0]&&at[1]);
						};
					}
					this.alterarDias(fun);
					return this;
				},
				addDia:function(dia, tr){
					var ret={
						data:[d[0], d[1], dia],
						el:Jesm.el('a', 'href=javascript:void(0)', Jesm.el('td', null, tr), dia),
						setAtivo:function(bool){
							this.el[((this.ativo=bool)?'add':'remover')+'Classe']('ativo');
						},
						setAtual:function(bool){
							this.el[((this.atual=bool)?'add':'remover')+'Classe']('atual');
						}
					};
					ret.el.onclick=function(){
						if(ret.ativo)
							THIS.clique(ret);
					};
					this.lista[dia]=ret;
					return ret;
				},
				alterarDias:function(fun){				
					for(var x=this.lista.length;--x;){
						var dia=this.lista[x];
						if(!dia)
							break;
						fun.call(dia);
					}
				}
			};
			switch(d[1]){
				case 3: case 5: case 8: case 10:
					novoMes.diasNoMes=30;
				break;
				case 1:
					var ano=d[0];
					novoMes.diasNoMes=((!(ano%4)&&ano%100)||!(ano%400))?29:28;
				break;
				default:
					novoMes.diasNoMes=31;
			}
			novoMes.diaSemana=(this.toDate(d).getDay()-this.cfg.comecoSemana+7)%7;
			anos[d[0]][d[1]]=novoMes;
		}
		return anos[d[0]][d[1]];
	};
	
	this.setLimite=function(str, d){
		str=str.toLowerCase().split('');
		str[0]=str[0].toUpperCase();
		str=str.join('');
		this.cfg['limite'+str]=d;
		var dif=this.compararDatas(this.toArray(d), this.func.mesAtual)==(str=='Passado'?-1:1);
		if(this.func.pronto){
			for(var x=this.func.anos.length, anoAtual;x--&&(anoAtual=this.func.anos[x]);)
				for(var y=anoAtual.length, mesAtual;y--&&(mesAtual=anoAtual[y]);mesAtual.verificar());
			if(dif)
				this.mover(-this.diferencaData(d));
			else
				this.verificarSetas();
		}
		else if(dif)
			this.setDiaInicio(d);
	}
	
	this.openFrag=function(indo){
		this.func.indo=indo;
		this.els.frag=document.createDocumentFragment();
	};
	
	this.closeFrag=function(){
		var tab=this.els.tabelaMesesBody;
		tab.insertBefore(this.els.frag, this.func.indo?null:tab.firstChild);
	};
	
	this.atualizarMes=function(){
		var THIS=this;
		this.animas.titulo.go(.25, [0], function(){
			THIS.els.tituloMes.innerHTML=THIS.cfg.meses[THIS.func.mesAtual[1]];
			THIS.els.tituloAno.innerHTML=THIS.func.mesAtual[0];
			this.go(.25, [1]);
		});
		return this;
	};
	
	this.abrir=function(x, y){
		Jesm.css(this.els.main, 'display:block;left:'+x+'px;top:'+y+'px');
		this.animas.opacidade.go(.5, [1]);
		if(!this.func.pronto)
			this.iniciar();
		this.updateMedidas();
		return this;
	};
	
	this.fechar=function(){
		this.animas.opacidade.go(.25, [0], 'none');
		return this;
	};
	
	this.clique=function(td){
		if(this.onselect)
			this.onselect(this.toDate(td.data));
		this.fechar();
	};
	
	this.associarInput=function(input, depois){
		this.els.input=input;
		this.onselect=depois;
		Jesm.addEvento(input, 'focus', function(){
			var dimTela=(config.elHolder?Jesm.Cross.offsetSize(config.elHolder):Jesm.Cross.inner())[0], disEl=Jesm.Cross.offset(input), dimEl=Jesm.Cross.client(input), left, top;
			if(dimTela-disEl[0]-dimEl[0]>250){
				left=disEl[0]+dimEl[0]+10;
				top=disEl[1];
			}
			else{
				var temp=(dimEl[0]<=250)?dimEl[0]-250:0;
				left=disEl[0]+temp;
				top=disEl[1]+dimEl[1]+10;
			}
			this.abrir(left, top);
		}, this);
		return this;
	};
	
	this.verificarSetas=function(){
		for(var x=2, str=['Esq', 'Dir'], str1=['Passado', 'Futuro'];x--;){
			var limite=this.cfg['limite'+str1[x]];
			if(limite){
				confere=limite&&this.func.mesAtual[0]==limite.getFullYear()&&this.func.mesAtual[1]==limite.getMonth();
				Jesm.css(this.els['seta'+str[x]], 'visibility:'+(this.func.setas[x]=!confere?'visible':'hidden'));
			}
		}
		return this;
	};
	
	this.updateMedidas=function(){
		var alturaTd=Jesm.Cross.offsetSize(this.els.tabelaMeses.pega('td', 0))[1];
		this.els.tabelaMeses.style.top='-'+(this.func.top*alturaTd)+'px';
		this.animas.altura.go(.5, [this.getMes().linhas*alturaTd]);
		this.animas.cima.go(.5, [-this.func.offset*alturaTd]);
		return this;
	}
	
	this.iniciar=function(){
		this.openFrag(true);
		this.addMes(true);
		this.closeFrag();
		this.mover(0);
		this.getMes().verificar();
		this.getMes(this.andarMes(this.func.mesAtual, -1)).verificar();
		this.getMes(this.andarMes(this.func.mesAtual, 1)).verificar();
		this.atualizarMes();
		this.func.pronto=true;
		if(Jesm.Core.drag){
			var drag=new Jesm.Drag(this.els.main, this.els.titulo.addClasse('grab'));
			drag.onDragStart=function(){
				THIS.animas.opacidade.go(.25, [.7]);
			};
			drag.onDrop=function(){
				THIS.animas.opacidade.go(.25, [1]);
			};
		}
	};
	
	this.setDiaInicio=function(d){
		if(!this.func.pronto)
			this.func.mesAtual=this.toArray(this.cfg.diaInicio=d);
	}
	
	this.cfg={
		meses:['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		dias:['D','2ª','3ª','4ª','5ª','6ª','S'],
		divisor:'/',
		comecoSemana:0,
		diaInicio:new Date(),
		fecharText:'Fechar'
	};
	config=config||{};
	for(var str in config)
		this.cfg[str]=config[str];
	for(var x=2, str=['Passado', 'Futuro'];x--;){
		var limite=this.cfg['limite'+str[x]];
		if(!limite)
			continue;
		var timeInicio=this.cfg.diaInicio.getTime(), timeLimite=limparData(limite).getTime();
		if(x?timeLimite<timeInicio:timeLimite>timeInicio){
			console.log('Verifique seu limite'+str[x]);
			return;
		}
	}
	
	this.func={
		pronto:false,
		sit:0,
		proxSit:[-1, 1],
		numTr:[0, 0],
		anos:[],
		setas:[true, true],
		top:0,
		offset:0
	};
	this.setDiaInicio(this.cfg.diaInicio);
	
	this.els={};
	this.animas={};
	var THIS=this, frag=document.createDocumentFragment();
	
	this.els.main=Jesm.css(Jesm.el('div', 'class=jesm_calendar', frag), 'opacity:0');
	this.animas.opacidade=new Jesm.Anima(this.els.main, 'opacity');
	
	this.els.cabeca=Jesm.el('div', 'class=cabeca', this.els.main);
	this.els.setaEsq=Jesm.el('a', 'class=seta esq;href=javascript:void(0)', this.els.cabeca, '&#9664;');
	this.els.setaDir=Jesm.el('a', 'class=seta dir;href=javascript:void(0)', this.els.cabeca, '&#9654;');
	this.els.titulo=Jesm.el('div', 'class=title', this.els.cabeca);
	this.animas.titulo=new Jesm.Anima(this.els.titulo, 'opacity');
	this.els.tituloMes=Jesm.el('span', 'class=mes', this.els.titulo);
	this.els.tituloDivisor=Jesm.el('span', 'class=divisor', this.els.titulo, this.cfg.divisor);
	this.els.tituloAno=Jesm.el('span', 'class=ano', this.els.titulo);
	
	this.els.content=Jesm.el('div', 'class=main', this.els.main);
	this.els.diasSemana=Jesm.el('tr', null, Jesm.el('tbody', null, Jesm.el('table', 'class=head', this.els.content)));
	for(var x=0;x<7;Jesm.el('th', null, this.els.diasSemana, this.cfg.dias[(this.cfg.comecoSemana+(x++))%7]));
	this.els.tables=Jesm.el('div', 'class=tables', this.els.content);
	this.animas.altura=new Jesm.Anima(this.els.tables, 'height');
	this.els.meses=Jesm.el('div', 'class=meses', this.els.tables);
	this.animas.cima=new Jesm.Anima(this.els.meses, 'margin-top');
	this.els.tabelaMeses=Jesm.el('table', null, this.els.meses);
	this.els.tabelaMesesBody=Jesm.el('tbody', null, this.els.tabelaMeses);
	
	this.els.fechar=Jesm.el('a', 'class=fechar;href=javascript:void(0)', this.els.content, this.cfg.fecharText);
	Jesm.addEvento(this.els.fechar, 'click', this.fechar, this);
	if(this.cfg.hoje){
		this.els.hoje=Jesm.el('a', 'class=hoje', this.els.content);
		Jesm.addEvento(this.els.hoje, 'click', this.irDiaAtual, this);
	}
	(config.elHolder||document.body).appendChild(frag);
	
	Jesm.addEvento(this.els.setaEsq, 'click', function(){
		if(this.func.setas[0])
			this.mover(-1);
	}, this);
	Jesm.addEvento(this.els.setaDir, 'click', function(){
		if(this.func.setas[1])
			this.mover(1);
	}, this);
	
	if(config.clickOut){
		Jesm.addEvento(document.body, 'click', function(){
			this.fechar();
		}, this);
		Jesm.addEvento(this.els.main, 'click', function(e){
			e.stopPropagation();
		});
	}
}