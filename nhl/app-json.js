'use strict';

let nhl = {
  Gordie: [],
  WayneGretzky: [],
  MarioLemieux(getUrl, data){
    let proxyUrl  = 'https://cors-anywhere.herokuapp.com/';
    let targetUrl = getUrl;
    let that;
    fetch(proxyUrl + getUrl)
    .then(response => response.json())
    .then(arr => nhl[data] = arr);
  },
  StanleyCupFinal: [],
  init(g, o){
    this.cleanFm();
    //console.log( (""+o.constructor).split("function ")[1].split("(")[0] );
    //console.log( o.constructor.name );
    nhl_cos.textContent = (o['season']);
    this.roundExecFm(g, o['data_left'],  'left' );
    this.roundExecFm(g, o['data_right'], 'right');

    this.showLineWin( document.querySelectorAll('.scope_win')[0] );
    //nhl.showSeriaFm( document.querySelectorAll('.scope_win')[0] );
    /* or */
    //this.showSeriaFm( document.querySelectorAll('.scope_win')[0] );
  },
  addHtml(el, numArea, metod, tpl){
  //numArea=0|1|2|3; metod=html|text|elem
  //let arrArea = ['beforebegin','beforeend','afterbegin','afterend'];
    let mtd = {
      html:'insertAdjacentHTML',
      text:'insertAdjacentText',
      elem:'insertAdjacentElement',
      0:'beforebegin',
      1:'afterbegin',
      2:'beforeend',
      3:'afterend'
    };
    el[mtd[metod]](mtd[numArea], tpl);
    return this;
  },
  searchTeam(obj, mk, pitch){
        if( pitch==='mark'){
          return Object.keys(obj[mk]);
        }
        if( pitch==='team' ){
          return obj[mk]['team'];
        }
        if( pitch==='url' ){
          return obj[mk]['url_num'];
        }
    //return null;
  },
  roundWinnerFm(arr, mark){
    //console.log(arr);
    let newStr=[], ar1=[], ar2=[];
    
    arr[0].forEach( function(el, iy, array){
      if( mark==='short' ){
        let q = ( el > arr[1][iy] ) ? 1 : 2;
        ( q === 1 ) ? ar1.push(q) : ar2.push(q);
        let str = ar1['length'] +':'+ ar2['length'];
        if( iy === array.length-1 ) {
          newStr.push(str);
        }
      }
      if( mark==='full' ){
        let str = el+':'+arr[1][iy];
        newStr.push(str);
      }
    });
    return newStr;
  },
  teamSortZero(a,b){
    let za = a.filter((i) => {
      let key = Object.keys(i);
      if( i[key]['Next'] !== undefined ) return i;
    });
    let zb = b.filter((i) => {
      let key = Object.keys(i);
      if( i[key]['Next'] !== undefined ) return i;
    });
    return ( za > zb ) ? -1 : 1;
  },
  teamSort(a,b){
    let keya = Object.keys(a), keyb = Object.keys(b);
    return ( a[keya]['Next'] > b[keyb]['Next'] ) ? -1 : 1;
  },
  roundExecFm(go, data, vec){
    let arrayRound1 = [];
    let arrayRound2 = [];
    let conferenceFinals = [];
    data.forEach( (val, idx, array) => {

      let round = val['bands'];
      let team_key = Object.keys(round); // ["Winnipeg_Jets", "St_Louis_Blues"]
      let team_pair = team_key.map( (el, idx) => {
        let relObj = {};
        let rel = round[el];
        relObj[el] = rel; // ['team1': {'Round1'}]

        //arrayRound1.push( relObj );
        if( rel['Next'] !== undefined ) arrayRound2.push( relObj );
        if( rel['ConferenceFinals'] !== undefined ) conferenceFinals.push( relObj );
        if( rel['StanleyCupFinal'] !== undefined ) nhl['StanleyCupFinal'].push( relObj );

        return relObj; // Round1: ['team1': {'Round1'}, 'team2': {'Round1','Round2'}]
      });
      arrayRound1.push(team_pair)

      if( arrayRound1.length===4 ){
        let arrayRound1_z = arrayRound1.sort( nhl.teamSortZero );
        //console.log(arrayRound1);
        //console.log(arrayRound1_z);
        arrayRound1_z.forEach( (a, i) => {
          //arr_pair.push(a);
          if( a.length===2){
            nhl.drawRoundFm( go, a, 'Round1', vec, (vec+'_round1') );
          }
        });
      }

      if( arrayRound2.length===4 ){
        let arr_pair = [];
        //let arrayRound2_z = arrayRound2.sort( nhl.teamSort );
        arrayRound2.forEach( (a, i) => {
          arr_pair.push(a);
          if( arr_pair.length===2){
            nhl.drawRoundFm( go, arr_pair, 'Round2', vec, (vec+'_round2') );
            return arr_pair=[];
          }
        });
      }

      if( conferenceFinals.length===2 ){
        nhl.drawRoundFm( go, conferenceFinals, 'ConferenceFinals', vec, (vec+'_round3') );
        conferenceFinals=[];
      }
      if( nhl['StanleyCupFinal'].length===2 && vec==='right' ){
        nhl.drawChampionFm( go, nhl['StanleyCupFinal'], 'StanleyCupFinal', vec, 'cup_final' );
        nhl['StanleyCupFinal']=[];
      }

      //console.log(team_pair);
    });
  },
  drawRoundFm(go, arr, key, conf, container){
    let d=document,
    rblock=d.createElement('div');

    if( arr.length===2 ){
      let name_team0 = String(Object.keys(arr[0]));
      let name_team1 = String(Object.keys(arr[1]));

      let team0 = nhl.searchTeam(go, name_team0, "team");
      let team1 = nhl.searchTeam(go, name_team1, "team");


      let url0 = nhl.searchTeam(go, name_team0, "url");
      let url1 = nhl.searchTeam(go, name_team1, "url");

      let obj_team0  = arr[0][name_team0];
      let obj_team1  = arr[1][name_team1];
      let site = 'https://www.sportslogos.net/logos/list_by_team/';

      let link0 = site+(url0)+'/'+(team0)+'/';
      let link1 = site+(url1)+'/'+(team1)+'/';
      let round_winer = [obj_team0[key], obj_team1[key]];
      let reswin = this.roundWinnerFm(round_winer, 'full');
      let rw = this.roundWinnerFm(round_winer, 'short')[0];


      //rblock.dataset['id'] = `id_${'---'}`;
      rblock.classList.add('round-block');

      this.addHtml(rblock, 2, 'html', `<span class="score" data-series="${reswin}" data-teams="${team0}:${team1}" data-winer="${rw}">${rw.split(':')[0]}:${rw.split(':')[1]}</span>`);
      this.addHtml(rblock, 2, 'html', `<a href="${link0}" class="link link_top ${team0}" title="${team0}" target="_blank"></a>`);
      this.addHtml(rblock, 2, 'html', `<a href="${link1}" class="link link_bot ${team1}" title="${team1}" target="_blank"></a>`);
    }

    this.addHtml(d['getElementById'](container), 2, 'elem', rblock);
  },
  drawChampionFm(go, arr, key, conf, container, fuckyoutoomate){
    let d=document,
    rblock=d.createElement('div'),
    ch_block = d.createElement('div');
    ch_block.classList.add('thebest');

    if( arr.length===2 ){
      let name_team0 = String(Object.keys(arr[0]));
      let name_team1 = String(Object.keys(arr[1]));

      let team0 = nhl.searchTeam(go, name_team0, "team");
      let team1 = nhl.searchTeam(go, name_team1, "team");

      let url0 = nhl.searchTeam(go, name_team0, "url");
      let url1 = nhl.searchTeam(go, name_team1, "url");

      let obj_team0  = arr[0][name_team0];
      let obj_team1  = arr[1][name_team1];
      let site = 'https://www.sportslogos.net/logos/list_by_team/';

      let link0 = site+(url0)+'/'+(team0)+'/';
      let link1 = site+(url1)+'/'+(team1)+'/';

      let round_winer = [obj_team0[key], obj_team1[key]];
      let reswin = this.roundWinnerFm(round_winer, 'full');
      let rw = this.roundWinnerFm(round_winer, 'short')[0];

      /* if the champion isn't undefined -> break */
      //console.log( fuckyoutoomate.length );
      /*if( fuckyoutoomate.length < 4 || o['champion'] !== 4 ){
        this.addHtml(ch_block, 2, 'html', '<h4 class="name_champion">the champion is unknown yet</h4>');
        this.addHtml(d['getElementById'](container), 2, 'elem', ch_block);
        return;
      }*/

      if( ch_block ){
        let win_idx = ( rw.split(':')[0] > rw.split(':')[1] ) ? 0 : 1;
        let name_team = String(Object.keys(arr[win_idx]));
        let obj_team  = arr[win_idx][name_team];
        let team = nhl.searchTeam(go, name_team, "team");
        //let link = site+(obj_team['link_fm'])+'/'+(name_team)+'/';
        let url = nhl.searchTeam(go, name_team, "url");
        let link = site+(url)+'/'+(team)+'/';

        this['winTeam'] = team;//name_team;
        //console.log(win_idx);
        rblock.classList.add('round-block');
        rblock.classList.add('winner');

        this.addHtml(ch_block, 2, 'html', `<a href="${link}" class="link link_champion ${team}" title="${team}"></a>`);
        this.addHtml(ch_block, 2, 'html', '<h4 class="name_champion">'+(`${team}`)+'</h4>');
      }

      /****/

      this.addHtml(rblock, 2, 'html', `<span class="score scope_win" data-series="${reswin}" data-teams="${team0}:${team1}" data-winer="${rw}">${rw.split(':')[0]}:${rw.split(':')[1]}</span>`);
      this.addHtml(rblock, 2, 'html', `<a href="${link0}" class="link link_top ${team0}" title="${team0}" target="_blank"></a>`);
      this.addHtml(rblock, 2, 'html', `<a href="${link1}" class="link link_bot ${team1}" title="${team1}" target="_blank"></a>`);
    }

    this.addHtml(d['getElementById'](container), 2, 'elem', rblock);
    this.addHtml(d['getElementById'](container), 2, 'elem', ch_block);
  },
  showSeriaFm(that){
    let win = null;
    let teams = that.dataset.teams['split'](':');
    let score = that.dataset.winer['split'](':');
    let series = that.dataset.series['split'](',');
    let dseries = document.querySelectorAll('#d_series li');

    //let ds = that.parentNode.dataset;
    let ds = that.parentNode.classList[0];
    
    //if(that.parentNode.nextSibling === null){
    if( ds==='winner'){
      cup_final.classList.add('greeno');
    } else {
      cup_final.classList.remove('greeno');
    }

    [].forEach.call(document.querySelectorAll('.round-block'), function(el){
      if( el.childNodes[0] !== that ) el.classList.remove('activisto');
    });
    that.closest('.round-block').classList.add('activisto');

    ab_team_top.className = '';
    ab_team_bot.className = '';
    if( +score[0] > +score[1] ){
      ab_team_top.className = 'champony';
      win = 0;
    } else {
      ab_team_bot.className = 'champony';
      win = 1;
    }
    ab_team_top.textContent = (teams[0] +'['+ score[0]);
    ab_team_bot.textContent = (score[1] +']'+ teams[1]);

    for( let el of dseries){
      el.remove();
    }

    for( let i=0; i<series.length; i++){
      let s = series[i].split(':');
      let bold = ( win != Number(s[0] > s[1]) ) ? 'bolder' : '';
      let text = (series[i].length!==0) ? series[i] : '?';
      nhl.addHtml(d_series, 2, 'html', `<li class="${bold}">${text}</li>`);
    }
    return false;
  },
  showLineWin( target ){
    //search all .round-block a with winner name
    let wt = this['winTeam'];
    let count = 1;
    this.showSeriaFm( target );
    [].forEach.call(document.querySelectorAll('.round-block a'), function(el, idx){
      let link = el.getAttribute('title');
      let mom = el.parentNode;
      if(link === wt) {
        let timer = count++;//1,2,3,4
        setTimeout( function() {
          mom.classList.add('activisto');
        }, 200*timer);
      }
    });
    count=1;
    return null;
  },
  cleanFm(){
    nhl_cos.innerHTML = '';
    document.getElementById('cup_final').innerHTML = '';
    left_round1.innerHTML = '';
    left_round2.innerHTML = '';
    left_round3.innerHTML = '';
    right_round3.innerHTML = '';
    right_round2.innerHTML = '';
    right_round1.innerHTML = '';
    ab_team_top.innerHTML = '';
    final_score.innerHTML = '';
    ab_team_bot.innerHTML = '';
    d_series.innerHTML = '';
  }
};

document.addEventListener('click', function(e){
  let that = e.target;
  if( that.classList[0] === 'score' ){
    nhl.showSeriaFm( that );
  }

  if( that.id === 'showPathWinner' ){
    nhl.showLineWin( document.querySelectorAll('.scope_win')[0] );
  }

  if( that.parentNode.dataset['cup'] ){
    /* find and draw season */
    let son = that.dataset['jseason'];
    let gor = nhl.Gordie[0];
    let obj = nhl.WayneGretzky[son];

    /* toggle class button-seson */
    nhl.init( gor, obj );
    nhl.showLineWin( document.querySelectorAll('.scope_win')[0] );
    if( that.parentNode.classList[0] !== 'activo' ){
      [].forEach.call(document.querySelectorAll('#cup_season li'), function(el){
        el.classList.remove('activo');
      });
      that.parentNode.classList.add('activo');
    }
    else {
      return;
    }
  }
  return false;
}, false);

window.addEventListener('load', function(){

  /* animation background */
  document.querySelectorAll('.pitch-box')[0].classList.add('start');
  setTimeout(function(){
    document.querySelectorAll('.pitch-box')[0].classList.remove('start');
  }, 3000);

  nhl.MarioLemieux('nhl-data.json', 'Gordie');
  nhl.MarioLemieux('http://comb.atwebpages.com/nhl/sn-all.json', 'WayneGretzky');
  let son = 0;
  let g = nhl.Gordie[0];
  let o = nhl.WayneGretzky[son];

  if( o !== undefined ){
    nhl.init( g, o );
  } else {
    setTimeout( () => {
      nhl.MarioLemieux('http://comb.atwebpages.com/nhl/nhl-data.json', 'Gordie');
      nhl.MarioLemieux('http://comb.atwebpages.com/nhl/sn-all.json', 'WayneGretzky');
      g = nhl.Gordie[0];
      o = nhl.WayneGretzky[son];
      nhl.init( g, o );
    }, 3000);
  }
});