(function(){
  function renderLocal(){
    try{var p=JSON.parse(localStorage.getItem('olpw-chess-profile')||'{}');if(p.rating){var t=document.getElementById('rows');t.innerHTML='<tr><td>–</td><td>You (local)</td><td>'+p.rating+'</td><td>'+(p.games||0)+'</td></tr>';}}catch(e){}
  }
  function refresh(){
    var db=window.firebase&&firebase.firestore?firebase.firestore():null;
    if(!db){renderLocal();return;}
    db.collection('leaderboard').orderBy('rating','desc').limit(50).get().then(function(snap){
      var t=document.getElementById('rows');t.innerHTML='';var i=0;
      if(snap.empty){renderLocal();return;}
      snap.forEach(function(d){i++;var v=d.data();t.innerHTML+='<tr><td>'+i+'</td><td>'+(v.name||'Anonymous')+'</td><td>'+(v.rating||0)+'</td><td>'+(v.games||0)+'</td></tr>';});
    }).catch(function(){renderLocal();});
  }
  document.getElementById('pubBtn').addEventListener('click',function(){
    var u=window.firebase&&firebase.auth?firebase.auth().currentUser:null;
    if(!u){document.getElementById('msg').textContent='Sign in on the home page first.';return;}
    var p={};try{p=JSON.parse(localStorage.getItem('olpw-chess-profile')||'{}');}catch(e){}
    firebase.firestore().collection('leaderboard').doc(u.uid).set({name:u.displayName||u.email||'Student',rating:p.rating||1200,games:p.games||0},{merge:true}).then(function(){document.getElementById('msg').textContent='Published!';refresh();});
  });
  window.addEventListener('load',refresh);
})();
