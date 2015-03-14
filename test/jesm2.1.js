function jesm(e){return e||console.error("O objeto "+(""+e)+" é nulo."),e.pega=function(e,t,n){var i
switch(e.toLowerCase()){case"classe":case"class":case".":if(this.getElementsByClassName)i=this.getElementsByClassName(t)
else{i=[]
for(var o=0,r=this.getElementsByTagName("*"),a=r.length;a>o;o++)r[o].className!=null&&r[o].className.indexOf(t)!=-1&&i.push(r[o])}break
case"id":case"#":i=jesm(document.getElementById(t))
break
case"name":i=document.getElementsByName(t)
break
case"</>":case"<>":case"tag":case"tagname":i=this.getElementsByTagName(t)}return null!=n&&(i=i.length?jesm(i[n]):null),null==i&&console.log(e+", "+t+", "+n+" retornaram 'null'"),i},e}function j(e,t){var n=e.split(""),i=n.shift()
return"#"==i?jesm(document.getElementById(n.join(""))):"."==i&&isNaN(t)?document.pega(".",n.join("")):document.pega(".",n.join(""),t)}function anima(){if(arguments[0]==null)return console.error("O elemento não foi indicado"),!1
this.elemento=arguments[0],this.propriedade=[],this.sufixo=[],this.prefixo=[]
for(var e=0;++e<arguments.length;)arguments[e]!=""&&(this.propriedade.push(arguments[e]),this.sufixo.push(""),this.prefixo.push(""))
this.ativo=!1,this.depois=!1,this.tipo="ease"
for(var e=this.propriedade.length;e--;)oldIE()&&this.propriedade[e]=="opacity"&&(this.propriedade[e]="filter",this.prefixo[e]="alpha(opacity=",this.sufixo[e]=")",getStyle(this.elemento,"filter")==""&&(this.elemento.style.filter="alpha(opacity=100)"))
return this.go=function(){if(arguments[0]==null)return console.error("A duração não foi indicada"),!1
this.ativo&&this.stop()
for(var e,t=[],n=[],i=[],o=[],r=this,a=[],s=[],l=this.elemento.style,u=this.prefixo,c=this.sufixo,d=0;++d<arguments.length;)arguments[d]!=null&&(n.push(arguments[d]),i.push(this.propriedade[d-1]))
e=i.length
for(var d=0;e>d;d++){if(this.sufixo[d]==""&&this.prefixo[d]==""){for(var m=0,f=["px","mm","pt","cm","%","em"],h=f.length;h>m;m++)getStyle(this.elemento,i[d]).indexOf(f[m])!=-1&&(this.sufixo[d]=f[m])
t[d]=Number(getStyle(this.elemento,i[d]).replace(this.sufixo[d],""))}else t[d]=Number(getStyle(this.elemento,i[d]).replace(this.sufixo[d],"").replace(this.prefixo[d],""))
for(i[d]=="filter"&&(n[d]*=100),n[d]=="auto"&&i[d]=="height"?n[d]=altAuto(this.elemento):n[d]=="auto"&&i[d]=="width"&&(n[d]=largAuto(this.elemento));i[d].indexOf("-")!=-1;){var p=i[d].indexOf("-")
i[d]=i[d].split("")
var g=i[d][p+1].toUpperCase()
i[d][p+1]=g,i[d][p]="",i[d]=i[d].join("")}o[d]=n[d]-t[d],a[d]=n[d]>t[d]?1:-1,s[d]=n[d]*a[d]}var w=+new Date,v=arguments[0]*1e3,y=geraEase(this.tipo,v)
return this.ativo=!0,window.jesmAnimator.addTarefa(function(){for(var d,m,f=e,h=+new Date-w;f--;m=y(o[f],h)+t[f],d=m*a[f]<s[f],l[i[f]]=u[f]+(d?m:n[f]).toFixed(3)+c[f]);return d?!1:function(){return r.ativo=!1,r.depois&&r.depois(),!0}()},this),this},this.stop=function(){return jesmAnimator.delTarefaByObj(this),this.ativo=!1,this},this.addTipo=function(e){return this.tipo=e,this},this.addDepois=function(e){return this.depois=e,this},this}function loadSrc(e,t,n){var i=new Image
i.src=t,i.onload=function(){e.src=i.src,null!=n&&(e.dep=n)()}}function ir(e,t,n){if(null==e)return console.error("O elemento não foi indicado"),!1
if(null==t)return console.error("A duração não foi indicada"),!1
jesmAnimator.delTarefaByObj(jesmIr)
var i=obCross("scrollPag"),o=findPos(e)
o[0]-=jesmIr.esquerda,o[1]-=jesmIr.topo,sod=[i[0]<o[0]?1:-1,i[1]<o[1]?1:-1],dif=[o[0]-i[0],o[1]-i[1]],posFinal_sod=[o[0]*sod[0],o[1]*sod[1]],n=n||"hv"
var r=+new Date,a=1e3*t,s=geraEase(jesmIr.tipo,a)
return jesmAnimator.addTarefa(function(){var e,t,a=+new Date-r
return scrollTo("v"==n?i[0]:(e=s(dif[0],a)+i[0])*sod[0]<posFinal_sod[0]?e:o[0],"h"==n?i[1]:(t=s(dif[1],a)+i[1])*sod[1]<posFinal_sod[1]?t:o[1]),e*sod[0]<posFinal_sod[0]||t*sod[1]<posFinal_sod[1]?!1:function(){return jesmIr.depois&&jesmIr.depois(),!0}()},jesmIr),this}function geraEase(e,t){switch(e){case"ease":return function(e,n){var i=n/t,o=Math.sin(Math.PI/2*(i>1?1:i))
return o*e}
case"ease-in":return function(e,n){var i=Math.pow(n/t,2)
return i*e}
case"ease-out":return function(e,n){var i=1-n/t
return i>=0?e-e*Math.pow(i,2):e}
case"ease-out-teste":return function(e,n){var i=n/t,o=i*e,r=o+(e-o)*i
return i>1?e:r}
case"sling":return function(e,n){var i=n/t,o=Math.sin(Math.PI/2*(i>1?1:i>.25?i-.5:-i))
return o*e}
default:return function(e,n){return n/t*e}}}function findPos(e,t){var n=0,i=0
if(e.offsetParent)for(;e.offsetParent&&e!=t;)n+=e.offsetTop,i+=e.offsetLeft,e=e.offsetParent
else e.y&&(n+=e.y,i+=e.x)
return[i,n]}function vAlign(e){e.style.marginTop=(e.parentNode.clientHeight-e.clientHeight)/2+"px"}function ajax(e,t,n,i){var o="",r="",a=new XMLHttpRequest||new ActiveXObject("Microsoft.XMLHTTP"),s=(n||"GET").toUpperCase()
return"POST"==s?o=t:r="?"+t,a.open(s,e+r,!0),"POST"==s&&a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send(o),i&&(a.depois=i,a.onreadystatechange=function(){a.readyState==4&&a.depois()}),a}function altAuto(e){var t=[e.style.height,e.style.display]
e.style.height="auto",e.style.display=""
var n=e.clientHeight
return e.style.height=t[0],e.style.display=t[1],n}function largAuto(e){var t=[e.style.width,e.style.display]
e.style.width="auto",e.style.display=""
var n=e.clientWidth
return e.style.width=t[0],e.style.display=t[1],n}function botaValue(e,t){document.pega("name",e,0).value=t}function dimDec(e,t){return Number(e.toFixed(t))}function getStyle(e,t){var n=""
return document.defaultView&&document.defaultView.getComputedStyle?n=document.defaultView.getComputedStyle(e,"").getPropertyValue(t):e.currentStyle&&(t=t.replace(/\-(\w)/g,function(e,t){return t.toUpperCase()}),n=e.currentStyle[t]),n}function botarTelaInteira(e){e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullScreen&&e.webkitRequestFullScreen()}function tirarTelaInteira(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen&&document.webkitCancelFullScreen()}function obCross(e,t){switch(e){case"scrollPag":return[window.pageXOffset||document.documentElement.scrollLeft,window.pageYOffset||document.documentElement.scrollTop]
case"dimTela":return[window.innerWidth||Math.min(document.body.clientWidth,document.documentElement.clientWidth),window.innerHeight||Math.min(document.body.clientHeight,document.documentElement.clientHeight)]
case"disEl":case"posEl":case"scrollEl":return findPos(t)
case"dimEl":return[t.clientWidth,t.clientHeight]
case"mouse":return[t.clientX,t.clientY]
default:console.error("Não foi encontrado a opção: '"+e+"'")}}function addEvento(e,t,n){return e.addEventListener?e.addEventListener(t,n):e.attachEvent?e.attachEvent("on"+t,n):!1}function cada(e,t){for(var n=-1,i=e.length;++n<i&&t(e[n],n,e)!=0;);}function css(e,t){t=t.split(";")
for(var n=t.length;n--;){var i=t[n].split(":")
i.length==2&&(i[0]=="opacity"&&oldIE()?(i[0]="filter",i[1]="alpha(opacity="+parseFloat(i[1],10)*100+")"):i[0]=="float"&&(i[0]="cssFloat"),e.style[i[0]]=i[1])}return e}function noArray(e,t){var n=-1
return cada(e,function(e,i){return e==t?(n=i,!1):void 0}),n}function oldIE(){return getStyle(document.body,"opacity")==null}jesm(document)
for(var x=0,vendors=["ms","moz","webkit","o"],len=vendors.length;len>x&&!window.requestAnimationFrame;x++)window.requestAnimationFrame=window[vendors[x]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[vendors[x]+"CancelAnimationFrame"]||window[vendors[x]+"CancelRequestAnimationFrame"]
var jesmAnimator={ativo:!1,tarefas:[],meteint:null,intervalo:14,guarda_obj:[],addTarefa:function(e,t){return window.jesmAnimator.guarda_obj.push(t),window.jesmAnimator.tarefas.push(e),this.ativo||(this.ativo=!0,window.requestAnimationFrame?function n(){var e=window.jesmAnimator
e.meteint=window.requestAnimationFrame(n)
for(var t=e.tarefas,i=t.length;i--;)t[i]()&&e.delTarefaByIndice(i)}():this.meteint=setInterval(function(){for(var e=window.jesmAnimator,t=e.tarefas,n=t.length;n--;)t[n]()&&e.delTarefaByIndice(n)},window.jesmAnimator.intervalo)),window.jesmAnimator.tarefas.length-1},delTarefaByIndice:function(e){this.tarefas.splice(e,1),this.guarda_obj.splice(e,1),this.tarefas.length||(this.ativo=!1,window.requestAnimationFrame?window.cancelAnimationFrame(this.meteint):clearInterval(this.meteint))},delTarefaByObj:function(e){for(var t=window.jesmAnimator.guarda_obj,n=t.length;n--;)if(t[n]==e){this.guarda_obj.splice(n,1),this.tarefas.splice(n,1)
break}this.tarefas.length||(this.ativo=!1,window.requestAnimationFrame?window.cancelAnimationFrame(this.meteint):clearInterval(this.meteint))}},jesmIr={esquerda:0,topo:0,depois:null,tipo:"ease",indice:null}