function pega(e,t){var n={l:[],a:function(e){for(var t=0,n=e.length;n>t;this.l.push(e[t++]));}},a=this!=window?this:document,r=function(e){var t
if((t=/^#(.+)$/i)&&-1!=e.search(t))return["id",e.match(t)[1]]
if((t=/^\.(.+)$/i)&&-1!=e.search(t))return["class",e.match(t)[1]]
if((t=/^\[(.+)=(.+)\]$/i)&&-1!=e.search(t)){var n=e.match(t)
return["attr",n[1],n[2]]}return["tag",e]}
return jesmCore.isElemento(e)?n=e:(cada(e.split(","),function(e){var t=r(e)
switch(t[0]){case"id":n=document.getElementById(t[1])
break
case"class":if(a.getElementsByClassName)n.a(a.getElementsByClassName(t[1]))
else{var s=RegExp("\\b"+t[1]+"\\b")
n.a(filtrar(a.getElementsByTagName("*"),function(e){return-1!=e.className.indexOf(t[1])&&-1!=e.className.search(s)}))}break
case"attr":a==document&&"name"==t[1]?n.a(document.getElementsByName(t[2])):n.a(filtrar(a.getElementsByTagName("*"),function(e){return e[t[1]]==t[2]}))
default:n.a(a.getElementsByTagName(t[1]))}}),null!=t&&(n=n.l.length?n.l["last"!=t?t:n.l.length-1]:null)),jesmCore.isElemento(n)&&(n.pega=pega,n.filhas=function(e){var t=r(e)
return filtrar(this.childNodes,function(e){switch(t[0]){case"class":return null!=e.className&&-1!=e.className.indexOf(t[1])&&-1!=e.className.search(RegExp("\\b"+t[1]+"\\b"))
case"attr":return e[t[1]]==t[2]
default:return e.tagName&&e.tagName.toLowerCase()==t[1].toLowerCase()}})},n.addClasse=function(e){return-1==noArray(this.className.split(" "),e)&&(this.className+=" "+e),this},n.removeClasse=function(e){return this.className=this.className.replace(RegExp("\\b"+e+"\\b"),""),this},n.temClasse=function(e){return RegExp("\\b"+e+"\\b").test(this.className)},n.del=function(){this.parentNode.removeChild(this)}),!n&&jesmCore.debugMode&&console.error("A seguinte string retornou null: "+e),n&&n.l?n.l:n}function anima(e,t,n){this.elemento=e,this.ativo=!1,this.tipo=n||"ease"
for(var a=[],r="ja"+ +new Date,s=-1,t=t.split(";"),o=t.length;++s<o;)if(t[s]){var i=!(oldIE()&&"opacity"==t[s])
a.push({p:i?t[s]:"filter",modelo:i?null:"alpha(opacity="+r+")"}),i||""!=getStyle(this.elemento,"filter")||css(this.elemento,"filter:alpha(opacity=100)")}this.addModelo=function(e,t,n){for(var s=a.length;s--;){var o=a[s]
if(o.p==e){o.modelo=t.replace(RegExp(n||"\\(ja\\)","g"),r)
break}}return this},this.go=function(e,t,n){this.ativo&&this.stop(),e*=1e3
for(var s=[],o=[],i=RegExp(r,"g"),l=t.length;l--;){var c=t[l]
if(null!=c){var u=a[l],h=getStyle(this.elemento,u.p),f=c
if("auto"==h){var d=obCross.cssSize(this.elemento)
switch(u.p){case"width":h=d[0]+"px"
break
case"height":h=d[1]+"px"}}if(null==u.modelo){u.modelo=r
for(var m=["mm","pt","cm","%","em","px"],p=m.length;p--;)if(-1!=h.search(m[p])){u.modelo+=m[p]
break}}h=parseFloat(h.match(RegExp(jesmCore.escapeRegExp(u.modelo).replace(i,"([-+]?[0-9]*.?[0-9]+)"),""))[1]),"filter"==u.p?f*=100:"auto"==f&&(o.push(u.p),f=jesmCore.getAuto(this.elemento,u.p)),s.push({p:jesmCore.cssPropToJs(u.p),m:u.modelo,eas:jesmCore.easer(this.tipo,e,h,f).start()})}}switch(n){case"none":n=function(){css(this.elemento,"display:none")}
break
case"del":n=function(){pega(this.elemento).del()}}this.ativo=!0
var v=s.length
return jesmCore.animator.addTarefa(function(){for(var e=v,t=e,a=+new Date;t--;){var r=s[t]
this.elemento.style[r.p]=r.m.replace(i,r.eas.gera(a).toFixed(3)),r.eas.c&&--e}return(e=!e)&&(this.ativo=!1,o.length&&css(this.elemento,o.join(":auto;")+":auto"),n&&n.call(this,this)),e},this),this},this.stop=function(){return jesmCore.animator.delTarefaByObj(this),this.ativo=!1,this}}function ir(e,t,n){var a=jesmCore.ir
a.ativo&&jesmCore.animator.delTarefaByObj(a),a.ativo=!0
for(var r=obCross.pageOffset(),s=obCross.disEl(e),o=[],i=[],l=2,c=2,u=+new Date,h=obCross.inner(),f=obCross.offset(),d=["esquerda","topo"];c--;)(i[c]=f[c]>h[c])&&l--,o[c]=jesmCore.easer(a.tipo,1e3*t,r[c],s[c]-=a[d[c]]).start(u)
jesmCore.animator.addTarefa(function(){for(var e=[],t=l,a=+new Date,s=2;s--;)e[s]=i[s]?o[s].gera(a):r[s],o[s].c&&t--
return scroll(e[0],e[1]),(t=!t)&&(this.ativo=!1,n&&n()),t},a)}function JesmAjax(e,t,n){this.url=e,this.depois=t,this.metodo=n||"POST",this.data={},this.escape=!0,this.go=function(){this.data.jesm_ajax=1
var e=[]
for(var t in this.data){var n=this.data[t]
n instanceof Array||(n=[null!=n?n+"":""])
for(var a=n.length;a--;e.push([t,this.escape?encodeURIComponent(n[a]):n[a]]));}return this.ajax=jesmCore.ajax.novo(this,e),this},this.text=function(){return this.ajax.responseText}}function JesmForm(e){var t=this
this.el=e,this.respostaEl=pega(e).pega(".jesm_form_resposta",0),this.cores={erro:"#D8442F",sucesso:"#009655",enviando:"#1166E8"},this.depois=function(){t.notify(this.text())},this.notify=function(e,t){if(!t)try{var n=obCross.getJson(e)
e=n.msg,t=this.cores[n.sucess?"sucesso":"erro"]}catch(a){var r=e.split(".;,")
e=r[0],t=r[1]}css(this.respostaEl,"backgroundColor:"+t).innerHTML=e},this.montar=function(e,t){var n=this
return this.pronto||(this.pronto=!0,addEvento(this.el,"submit",function(e){n.validar(t)&&n.enviar(n.depois).notify("Enviando...",n.cores.enviando),obCross.preventDefault(e||window.event)})),e&&(this.depois=e),this},this.validar=function(t){var n=[0,0,0],a="A"+Math.random()+"b"
t=t||this.cores.erro
for(var r=0,s=this.el.elements.length;s>r;r++){var o=this.el.elements[r],i=o.value,l=(o.getAttribute("type")||"").toLowerCase(),c=!(o.getAttribute("required")==o.getAttribute(a))
if(c&&!/\S/.test(i))n[0]++
else if(pega(o).temClasse("nl")&&/[A-zÀ-ú]/i.test(i))n[1]++
else{if("email"!=l||/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i.test(i))continue
n[2]++}var u="backgroundColor:",h=e.style[u]
css(o,u+t),addEvento(o,"focus",function(){css(o,u+h)})
break}for(var f=0,r=n.length;r--;f+=n[r]);if(f&&this.respostaEl){var d
switch(!1){case!n[0]:d=1==n[0]?"Ainda há um campo a ser preenchido.":"Ainda restam "+n[0]+" campos a serem preenchidos."
break
case!n[1]:d="Os campos em vermelho devem conter apenas números"
break
case!n[2]:d="Os campos em vermelho devem conter emails."}this.notify(d,this.cores.erro)}return!f},this.enviar=function(e){for(var t=new JesmAjax(this.el.action,e,this.el.method),n=this.el.elements,a=0,r=n.length;r>a;a++){var s=n[a],o=s.name
noArray(["radio","checkbox"],s.type)>-1&&!s.checked||(o?o.search(/\[\]$/)>-1?t.data[o]?t.data[o].push(s.value):t.data[o]=[s.value]:t.data[o]=s.value:(console.log(s),console.error('Elemento acima não possui atributo "name"')))}return t.go(),this}}function addEvento(e,t,n){t=t.split(",")
for(var a=0,r=t.length,s=e.addEventListener?"":"on",o=s?"attachEvent":"addEventListener";r>a;a++)"wheel"!=t[a]||"onwheel"in window||(t[a]="onmousewheel"in document?"mousewheel":"MozMousePixelScroll"),e[o](s+t[a],n)
return[e,t,n]}function delEvento(e){cada(e[1],function(t){e[0].removeEventListener?e[0].removeEventListener(t,e[2]):e[0].detachEvent("on"+t,e[2])})}function carregarImg(e,t,n){var a=new Image
a.src=e,a.onload=function(){n&&(n.src=this.src),t&&t()}}function oldIE(){return null==getStyle(document.body,"opacity")}function cada(e,t){for(var n,a=0,r=e.length;r>a&&(jesmCore.isElemento(n=e[a])&&pega(n),0!=t(n,a,e));a++);}function noArray(e,t){if(e.indexOf)return e.indexOf(t)
for(var n=0,a=e.length;a>n;n++)if(e[n]==t)return n
return-1}function filtrar(e,t){for(var n,a=[],r=0,s=e.length;s>r;r++)t(n=e[r])&&a.push(n)
return a}function divideAspa(e,t,n,a){t=t||",",n=n||"'"
var r=e.split(RegExp(t+"(?=(?:[^"+n+"]*"+n+"[^"+n+"]*"+n+")*[^"+n+"]*$)","gi"))
if(a)for(var s=RegExp("^ *"+n+"|"+n+" *$","g"),o=r.length;o--;r[o]=r[o].replace(s,""));return r}function criaElemento(e,t,n,a){var r=document.createElement(e)
if(t)for(var s=t.split(";"),o=s.length;o--;){var i=s[o].split("="),l=i.shift()
"class"==l&&(l+="Name"),r[l]=i.join("=")}return n&&n.appendChild(r),null!=a&&(jesmCore.isElemento(a)?r.appendChild(a):r.innerHTML=a),pega(r)}function css(e,t){t=t.split(";")
for(var n=t.length;n--;){var a=t[n].split(":"),r=a.shift(),s=a.join(":")
""!=r&&("opacity"==r&&oldIE()?(r="filter",s="alpha(opacity="+100*parseFloat(s)+")"):"float"==r&&(r="cssFloat"),e.style[jesmCore.cssPropToJs(r)]=s)}return e}function getStyle(e,t,n){var a,r=document
return r.defaultView&&r.defaultView.getComputedStyle?a=r.defaultView.getComputedStyle(e,"").getPropertyValue(t):e.currentStyle&&(a=e.currentStyle[jesmCore.cssPropToJs(t)]),n&&(a=parseFloat(a)),a}function valorCss(e,t){return getStyle(e,t,!0)}function ajax(e,t,n,a){var r=new JesmAjax(e,a,n)
return cada(t.split("&"),function(e){e=e.split("="),r.data[e[0]]=e[1]}),r.go().ajax}function jesmValidar(e,t,n,a){var r=new JesmForm(e)
r.respostaEl=t,r.montar(n,a)}for(var w=window,vendors=["moz","webkit"],len=vendors.length;len--&&!w.requestAnimationFrame;)w.requestAnimationFrame=w[vendors[len]+"RequestAnimationFrame"],w.cancelAnimationFrame=w[vendors[len]+"CancelAnimationFrame"]||w[vendors[len]+"CancelRequestAnimationFrame"]
var jesmCore={ajax:{limit:!1,ativo:!1,fila:[],novo:function(e,t){var n,a=new XMLHttpRequest,r=[]
e.metodo=e.metodo.toUpperCase()
for(var s=t.length;s--;r[s]=t[s].join("="));return n=r.join("&"),"GET"==e.metodo&&(e.url+="?"+n,n=null),a.open(e.metodo,e.url,!0),"POST"==e.metodo&&a.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8"),this.addFila([e,a,n]),a},addFila:function(e){var t=this
return this.fila.push(e),this.limit&&this.ativo||(this.ativo=!0,function n(){t.a&&t.a()
var e=t.fila.shift()
e[1].onreadystatechange=function(){4==this.readyState&&(t.d&&t.d(),e[0].depois&&e[0].depois(),t.fila.length?n():t.ativo=!1)},this.a&&this.a(),e[1].send(e[2])}()),this}},animator:{ativo:!1,tarefas:[],intervalo:13,enableRAF:!!window.requestAnimationFrame,addTarefa:function(e,t){if(this.tarefas.push([e,t]),!this.ativo){this.ativo=!0
var n=this,a=this.enableRAF,r=function(){var e=n
a&&(e.meteint=requestAnimationFrame(r))
for(var t=e.tarefas.length;t--;){var s=e.tarefas[t]
s[0].call(s[1])&&e.delTarefaByIndice(t)}}
this.meteint=a?requestAnimationFrame(r):setInterval(r,this.intervalo)}return this},delTarefaByIndice:function(e){this.tarefas.splice(e,1),this.tarefas.length||this.stop()},delTarefaByObj:function(e){for(var t=this.tarefas.length;t--;)this.tarefas[t][1]==e&&this.delTarefaByIndice(t)},stop:function(){this.ativo=!1,(this.enableRAF?cancelAnimationFrame:clearInterval)(this.meteint)}},easer:function(e,t,n,a){return{t:e,d:t,i:n,m:a-n,c:!1,p:!1,start:function(e){return this.s=e||+new Date,this},gera:function(e){var t=this.m
if(this.p||(e=((e||+new Date)-this.s)/this.d),1>e)switch(this.t){case"linear":t*=e
break
case"ease-in":t*=Math.pow(e,2)
break
case"ease-out":t-=t*Math.pow(1-e,2)
break
default:t*=Math.sin(Math.PI/2*e)}else this.c=!0
return t+this.i}}},ir:{ativo:!1,esquerda:0,topo:0,tipo:"ease"},getAuto:function(e,t){var n,a=[e.style[t],e.style.display]
switch(css(e,t+":auto;display:block"),t){case"width":n=obCross.client(e)[0]
break
case"height":n=obCross.client(e)[1]}return css(e,t+":"+a[0]+";display:"+a[1]),n},cssPropToJs:function(e){var t=/^-(.+)-(\w)/
return t.test(e)&&(e=e.replace(t,function(e,t,n){return("moz"!=t?t:"Moz")+n.toUpperCase()})),e.replace(/\-(\w)/g,function(e,t){return t.toUpperCase()})},escapeRegExp:function(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")},isElemento:function(e){return!(!e||!e.nodeType||1!=e.nodeType)},isFunction:function(e){return!(!e||"function"!=typeof e)},isTouchEvent:function(e){return-1!=e.type.indexOf("touch")},debugMode:!1},obCross={d:document,pageOffset:function(){var e=this.d.documentElement
return[window.pageXOffset||e.scrollLeft,window.pageYOffset||e.scrollTop]},inner:function(){for(var e=[],t=this.d,n=2,a=["Width","Height"];n--;e[n]=window["inner"+a[n]]||Math.min(t.body["client"+a[n]],t.documentElement["client"+a[n]]));return e},disEl:function(e,t){for(var n=[0,0];e.offsetParent&&e!=t;e=e.offsetParent)n[0]+=e.offsetLeft,n[1]+=e.offsetTop
return n},client:function(e){return[e.clientWidth,e.clientHeight]},offset:function(e){return e=e||this.d.body,[e.offsetWidth,e.offsetHeight]},cssSize:function(e){var t=[],n=["left","right","top","bottom"]
return cada(["width","height"],function(a,r){var s=getStyle(e,a)
"auto"==s&&(s=obCross.client(e)[r]-(parseFloat(getStyle(e,"padding-"+n[2*r]))+parseFloat(getStyle(e,"padding-"+n[2*r+1])))),t.push(s)}),t},stopPropagation:function(e){return e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},preventDefault:function(e){return e.preventDefault?e.preventDefault():e.returnValue=!1},target:function(e){return e.target||e.srcElement},which:function(e){return e.which||e.keyCode||0},textContent:function(e){return e.textContent||e.innerText||""},data:function(e,t,n){var a=!!e.dataset
return null!=n&&(a?e.dataset[t]=n:e.setAttribute("data-"+t,n)),a?e.dataset[t]:e.getAttribute("data-"+t)},placeholder:function(){cada(pega("input,textarea"),function(e){e.placeholder==e.value&&(e.value="")})},requestFullScreen:function(e){return e.requestFullScreen?e.requestFullScreen():e.webkitRequestFullScreen?e.webkitRequestFullScreen(e.ALLOW_KEYBOARD_INPUT):e.mozRequestFullScreen?e.mozRequestFullScreen():void 0},cancelFullScreen:function(){var e=this.d
return e.cancelFullScreen?e.cancelFullScreen():e.webkitCancelFullScreen?e.webkitCancelFullScreen():e.mozCancelFullScreen?e.mozCancelFullScreen():void 0},getMouse:function(e){for(var t=[],n=2,a=["X","Y"];n--;)t[n]=e["client"+a[n]]?e["client"+a[n]]:e.touches?e.touches[0]["page"+a[n]]:0
return t},wheelDelta:function(e,t){return t=["X","Y"][t||1],e["delta"+t]||e["wheelDelta"+t]||e.wheelDelta||e.detail},getJson:function(str){return window.JSON?window.JSON.parse(str):eval("("+str+")")}}