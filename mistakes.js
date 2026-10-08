(function(){
  function render(){
    var list=document.getElementById('list'), empty=document.getElementById('empty');
    var mt=[]; try{mt=JSON.parse(localStorage.getItem('olpw-mistakes')||'[]');}catch(e){}
    list.innerHTML='';
    if(!mt.length){empty.style.display='';return;}
    empty.style.display='none';
    mt.slice().reverse().forEach(function(m){
      var d=document.createElement('div');d.className='m';
      d.innerHTML='<b>'+(m.q||'')+'</b><small>Correct: '+(m.correct||'')+'</small>';
      list.appendChild(d);
    });
  }
  document.getElementById('clearBtn').addEventListener('click',function(){localStorage.removeItem('olpw-mistakes');render();});
  render();
})();
