const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require('cors');
const iconv = require('iconv-lite');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const itemdb = mysql.createConnection({
    user:"user1",
    host : "54.180.142.26",
    password:'12345678',
    database:"itemdb"
});
const spawn = require('child_process').spawn;


itemdb.connect();

const port = 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
// post: 생성, put: 수정, get: 받아오기, delete: 삭제

// 로그인
app.post('/api/login/', (req,res, next)=>{
    const userID = req.body.id
    const userPwd = req.body.password;
    const matchingQuery = "select * from itemdb.userinfo where userID = ?  AND userPwd = ?;"

    itemdb.query(matchingQuery, [userID, userPwd], function(err, login_res){
        if (err) {console.log("error: ", err)};
        if (login_res.length){
            resultlist = Object.values(login_res[0]);
            resultpwd = resultlist[1];
            resultlist = resultlist.toString();
            console.log(resultlist)

            res.send({
                message: "Login success",
                status: 'success',
                data: {
                    'id':userID,
                    'password':userPwd
                }
            });

        } else{
            res.send({
                message: "Login unsuccess",
                status: 'unsuccess',
                data: {
                    'id':userID,
                    'password':userPwd
                }
            });
        };
    });
});

// 회원가입 정보 express -> mysql로 데이터 저장
app.post('/api/join/:joinID/', (req, res) => {
    const userProfile = req.body.profile;
    const userName = req.body.username;
    const userID = req.body.id;
    const userPwd = req.body.password;
    const userBirth = req.body.birthday;
    const userSex = req.body.sex;

    const joinCheckQuery = 'SELECT (userID) from itemdb.userinfo where userID = (?);'
    const joinQuery = 'INSERT INTO itemdb.userinfo (userID, userPwd, userProfile, userName, userBirth, userSex) VALUES (?,?,?,?,?,?);'
    const joinQuerytolikedb = 'INSERT INTO itemdb.likedb (UID) VALUES (?);'
    const joinQuerytocollabdb = 'INSERT INTO itemdb.collabdb (UID) VALUES (?);'
    if (userProfile!=0 && userName!='' && userID!='' && userPwd!='' && userBirth!='' && userSex!=''){

        itemdb.query(joinCheckQuery, [userID], function(err, check_res){
         
            // 주민번호 숫자 자리수 6자리 에러 처리
            if (userBirth.toString().length!=6){
                res.send({
                    status: 'no_6_digits'
                });
            }
            // 성별 칸 숫자 자리수 1자리 에러 처리
            else if (Number(userSex)<1 || Number(userSex) >4){
                res.send({
                    status: 'no_1_digit'
                });
            }
            else if (Number(userBirth.substr(0,2))<68 && (Number(userSex)!=3 && Number(userSex)!=4)){       // 태어난 연도와 주민번호 뒷자리가 맞지 않을 때
                res.send({                                      //주민등록번호는 1968년도에 생김
                    status: 'no_1_digit'
                });
            }
            else if (Number(userBirth.substr(0,2))>=68 && (Number(userSex)!=1 && Number(userSex)!=2)){       // 태어난 연도와 주민번호 뒷자리가 맞지 않을 때
                res.send({
                    status: 'no_1_digit'
                });
            }
            else if (check_res.length){              // id 중복 처리
                console.log('number of same ID: ', check_res.length);
                console.log("found same ID: ", check_res[0]);
                res.send({
                    status: 'duplicated_id',
                    data: {'id':userID}
                });
            }
            else{                             // id 중복되지 않을 때
                res.send({
                    message: "Check ID successfully!",
                    status: 'check_success',
                    data: {
                        'profile':userProfile,
                        'username':userName,
                        'id':userID,
                        'password':userPwd,
                        'birthday':userBirth,
                        'sex':userSex
                    }
                });
                itemdb.query(joinQuerytolikedb,[userID]);
                itemdb.query(joinQuerytocollabdb,[userID]);
            }

            if (err){
                console.log("err: ", err);
            }
        });
    }
    else if (userID==''){
        res.send({
            message: "Fill out the rest!",
            status: 'not_complete',
        });

    } else {
        res.send({
            message: "Fill out the rest!",
            status: 'not_complete',
        });
    }
});

app.post('/api/join/:joinID/final', (req, res)=> {
    console.log("what? ", req.body);

    const joinProfile = req.body.joinProfile;
    const joinID = req.body.joinID;
    const joinName = req.body.joinName;
    const joinPwd = req.body.joinPwd;

    const joinBirth = req.body.joinBirth;   //아래에서 적용시켜야함
    const joinSex = req.body.joinSex;

    userTaste = req.body.taste;
    userRebuy = req.body.repurchase;
    userTexture = req.body.texture;

    userTasteDetail = [];
    userSweet = req.body.sweet;
    userSour = req.body.sour;
    userFruit = req.body.fruit;
    userMilk = req.body.milk;

    userFunction = [];
    userVita = req.body.vita;
    userBio = req.body.bio;
    userDiet = req.body.diet;
    userVagina = req.body.vagina;

    const joinQuery = 'INSERT INTO itemdb.userinfo (userID, userPwd, userProfile, userName, userBirth, userSex, userTaste, userRebuy, userTexture, userTasteDetail, userFunction) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    if (userTaste){
        userTaste = "맛있다"
    } else{
        userTaste = ""
    }
    if (userRebuy){
        userRebuy = "재구매의사"
    } else{
        userRebuy = ""
    }
    if (userTexture){
        userTexture = "목넘김"
    } else{
        userTexture = ""
    }
    if (userSweet){
        userSweet = "달콤"
        userTasteDetail.push(userSweet)
    }
    if (userSour){
        userSour = "새콤"
        userTasteDetail.push(userSour)
    }
    if (userFruit){
        userFruit = "과일맛"
        userTasteDetail.push(userFruit)
    }
    if (userMilk){
        userMilk = "우유맛"
        userTasteDetail.push(userMilk)
    }
    if (userVita){
        userVita = "피로회복"
        userFunction.push(userVita)
    }
    if (userBio){
        userBio = "장건강"
        userFunction.push(userBio)
    }
    if (userDiet){
        userDiet = "다이어트"
        userFunction.push(userDiet)
    }
    if (userVagina){
        userVagina = "질건강"
        userFunction.push(userVagina)
    }
    console.log(userTasteDetail);
    console.log(userFunction);

    itemdb.query(joinQuery, [joinID, joinPwd, joinProfile, joinName, joinBirth, joinSex, userTaste, userRebuy, userTexture, JSON.stringify(userTasteDetail), JSON.stringify(userFunction)], function(err, join_res){
        if (err) {
            console.log("err: ", err);
        } else {
            console.log("Inserted values successfully!");
            res.send({
                message: "Insert values successfully!",
                status: 'value_success',
                data: {'id':joinID}
            });
        }

    });
    
});

// Mypage
app.get('/api/onLogin/:userID/mypage', (req, res)=> {
    const userID = req.params;
    const userInfoQuery = 'SELECT * from itemdb.userinfo WHERE userID = (?)'

    itemdb.query(userInfoQuery, [userID.userID], function(err, info_res){

        console.log("info_res: ", info_res);
        if (err){
            console.log("err: ", err);
        }
        if (info_res.length){              // 존재하면
            console.log("found userInfo : ", info_res[0]);
            res.send({
                status: 'found_userInfo',
                data: {
                    'userID': info_res[0].userID,
                    'userPwd' : info_res[0].userPwd,
                    'userName' : info_res[0].userName,
                    'userProfile' : info_res[0].userProfile,
                    'userBirth' : info_res[0].userBirth,
                    'userSex' : info_res[0].userSex,
                    'userTaste' : info_res[0].userTaste,
                    'userTasteDetail' : info_res[0].userTasteDetail,
                    'userRebuy' : info_res[0].userRebuy,
                    'userTexture' : info_res[0].userTexture,
                    'userFunction' : info_res[0].userFunction
                }
            });
        } else{
            res.send({
                message: "No user information",
                status: 'failed_userInfo',
            });

        }

    });

});

// update : username
app.use('/api/user/:userID/mypage/edit/username', (req, res) => {
    const  { userID } = req.params;
    console.log(userID);
    console.log("req: ", req.body);

    usernameUpdate = req.body.username;

    const updateQuery = 'UPDATE itemdb.userinfo SET userName=? WHERE userID=?'



    itemdb.query(updateQuery, [usernameUpdate, userID], function(err, update_res){
        if (err) {
            console.log("update_username_err: ", err);
        } else {
            console.log("Update username values successfully!");
            res.send({
                message: "Update username values successfully!",
                status: 'update_username_success'
            });
        }

    });
});

// update : profile
app.use('/api/user/:userID/mypage/edit/profile', (req, res) => {
    const  { userID } = req.params;
    console.log(userID);
    console.log("req: ", req.body);

    profileUpdate = req.body.profile;

    const updateQuery = 'UPDATE itemdb.userinfo SET userProfile=? WHERE userID=?'

    itemdb.query(updateQuery, [profileUpdate, userID], function(err, update_res){
        if (err) {
            console.log("update_profile_err: ", err);
        } else {
            console.log("Update profile values successfully!");
            res.send({
                message: "Update profile values successfully!",
                status: 'update_profile_success'
            });
        }

    });
});

// update : taste
app.use('/api/user/:userID/mypage/edit/taste', (req, res) => {
    const  { userID } = req.params;
    console.log(userID);
    console.log("req: ", req.body);

    tasteUpdate = req.body.taste;

    updateTasteDetail = [];
    sweetUpdate = req.body.sweet;
    sourUpdate = req.body.sour;
    fruitUpdate = req.body.fruit;
    milkUpdate = req.body.milk;

    if (tasteUpdate=='yes'){
        tasteUpdate = '맛있다'
        if (sweetUpdate){
            sweetUpdate = "달콤"
            updateTasteDetail.push(sweetUpdate)
        }
        if (sourUpdate){
            sourUpdate = "새콤"
            updateTasteDetail.push(sourUpdate)
        }
        if (fruitUpdate){
            fruitUpdate = "과일맛"
            updateTasteDetail.push(fruitUpdate)
        }
        if (milkUpdate){
            milkUpdate = "우유맛"
            updateTasteDetail.push(milkUpdate)
        }
    }
    else{
        tasteUpdate = '';
    }


    console.log(updateTasteDetail)

    const updateQuery = 'UPDATE itemdb.userinfo SET userTaste=?, userTasteDetail=? WHERE userID=?'

    itemdb.query(updateQuery, [tasteUpdate, JSON.stringify(updateTasteDetail), userID], function(err, update_res){
        if (err) {
            console.log("update_taste_err: ", err);
        }
        else if (JSON.stringify(updateTasteDetail)=='[]'){
            res.send({
                message: "No detail pressed",
                status: 'no_detail_pressed'
            });
        } else {
            console.log("Update taste values successfully!");
            res.send({
                message: "Update taste values successfully!",
                status: 'update_taste_success'
            });
        }

    });
});

// update : texture
app.use('/api/user/:userID/mypage/edit/texture', (req, res) => {
    const  { userID } = req.params;
    console.log(userID);
    console.log("req: ", req.body);

    textureUpdate = req.body.texture;

    if (textureUpdate=='yes'){
        textureUpdate = "목넘김"
    } else {
        textureUpdate = ""
    }

    console.log(textureUpdate)

    const updateQuery = 'UPDATE itemdb.userinfo SET userTexture=? WHERE userID=?'

    itemdb.query(updateQuery, [textureUpdate, userID], function(err, update_res){
        if (err) {
            console.log("update_texture_err: ", err);
        } else {
            console.log("Update texture value successfully!");
            res.send({
                message: "Update texture value successfully!",
                status: 'update_texture_success'
            });
        }

    });
});

// update : repurchase
app.use('/api/user/:userID/mypage/edit/repurchase', (req, res) => {
    const  { userID } = req.params;
    console.log(userID);
    console.log("req: ", req.body);

    repurchUpdate = req.body.repurchase;

    if (repurchUpdate=='yes'){
        repurchUpdate = "재구매의사"
    } else {
        repurchUpdate = ""
    }

    console.log(repurchUpdate)

    const updateQuery = 'UPDATE itemdb.userinfo SET userRebuy=? WHERE userID=?'

    itemdb.query(updateQuery, [repurchUpdate, userID], function(err, update_res){
        if (err) {
            console.log("update_repurch_err: ", err);
        } else {
            console.log("Update repurchase value successfully!");
            res.send({
                message: "Update repurchase value successfully!",
                status: 'update_repurchase_success'
            });
        }

    });
});

// update : function
app.use('/api/user/:userID/mypage/edit/function', (req, res) => {
    const  { userID } = req.params;
    console.log(userID);
    console.log("req: ", req.body);

    updateFuncDetail = [];
    vitaUpdate = req.body.vita;
    bioUpdate = req.body.bio;
    dietUpdate = req.body.diet;
    vaginaUpdate = req.body.vagina;

    if (vitaUpdate){
        vitaUpdate = "피로회복"
        updateFuncDetail.push(vitaUpdate)
    }
    if (bioUpdate){
        bioUpdate = "장건강"
        updateFuncDetail.push(bioUpdate)
    }
    if (dietUpdate){
        dietUpdate = "다이어트"
        updateFuncDetail.push(dietUpdate)
    }
    if (vaginaUpdate){
        vaginaUpdate = "질건강"
        updateFuncDetail.push(vaginaUpdate)
    }

    console.log(updateFuncDetail)

    const updateQuery = 'UPDATE itemdb.userinfo SET userFunction=? WHERE userID=?'

    itemdb.query(updateQuery, [JSON.stringify(updateFuncDetail), userID], function(err, update_res){
        if (err) {
            console.log("update_func_err: ", err);
        }
        else {
            console.log("Update func values successfully!");
            res.send({
                message: "Update func values successfully!",
                status: 'update_func_success'
            });
        }

    });
});

// userinfo의 회원가입한 사람 수 받아오기
// 15명 미만이면 contents-based - server: /userID/recommend
// 15명 이상이면 ubcf - server: /userID/recommned/ubcf

// userinfo의 회원가입한 사람 수 받아오기
app.get('/api/user/:userID/recommend/count', (req, res)=> {
    const countQuery = 'SELECT userID FROM itemdb.userinfo;';
    itemdb.query(countQuery, function(err, num_res){
        console.log(num_res.length);
        if (err){
            console.log("count_user_err: ", err);
        } 
        else {
            res.send({
                message: "Count values successfully!",
                data : num_res.length
            });
        }
        
    });

});  

app.get('/api/data', (req,res) => {
    const query = 'SELECT ItemID,item,insta,youtube,맛,맛 상세,재구매의사,목넘김,기능 FROM itemdb;';
    itemdb.query(query, (err, rows) => { 
        if(err){
            console.log(err)}
        else{
            res.json(rows)
            }        
    })});

// Cold start : Contents-based
app.get('/api/user/:userID/recommend', (req, res) => {
      const { userID } = req.params;
      const query = 'SELECT userTaste,userTasteDetail,userRebuy,userTexture,userFunction FROM userinfo WHERE userID = ? ;';
      const query2 = 'SELECT ItemID,item,insta,youtube,맛,맛 상세,목넘김,재구매의사,기능 FROM itemdb WHERE ItemID in (?) ;';

      itemdb.query(query,[userID],function(err,rows) {
        featurelist = Object.values(rows[0]);
        featurelist = featurelist.toString();
        featurelist = featurelist.replace(/\[/g,' ');
        featurelist = featurelist.replace('재구매의사','재구매의사 ');
        featurelist = featurelist.replace(/\]/g,' ');
        featurelist = featurelist.replace('\\','');
        featurelist = featurelist.replace(/\"/g,'');
        featurelist = featurelist.replace(/\,/g,'');
        console.log('featurelist[',featurelist)


        let recommendItemList = [];

        const recommendlist = spawn('python',['./models/CBmodeling_combined.py',featurelist]);     

        recommendlist.stdout.on('data',function(data){
              rs = iconv.decode(data, 'euc-kr');
              rsarr = rs.split((/, |\]|\[/));
              rsarr = rsarr.slice(1,-1);
              resultarr =  rsarr.map(Number);
              //rsarr = rsarr[0]
             // console.log('rs의 개수: ',rsarr.length);
             // console.log(resultarr);
              var j = 0;
              itemdb.query(query2,[resultarr],function(err,rows){
                if (err){console.error('Error executing second query:',err);}
                else{
                  //console.log(Object.values(rows))

                    for (i= 0 ; i < resultarr.length; i++) {
                      //console.log(Object.values(rows[i]));
                      if (Object.values(rows[i])){
                      recommendItemList[j]= Object(rows[i]);
                      j++;
                      //console.log(recommendItemList)
                      //console.log('i:' ,i);
                     //console.log('j: ',j);
                      if (j==resultarr.length){
                        res.send(recommendItemList);
                      }
                    }
                      else{
                        j++;
                      }
      }}})

      });
      recommendlist.stderr.on('data', function(data) {
        console.log("222", data.toString());
    });
    
    });

});

// Post Cold-Start : UBCF
app.get('/api/user/:userID/recommend/ubcf', (req, res)=> {   
    const query = 'SELECT ItemID,item,insta,youtube,맛,맛 상세,목넘김,재구매의사,기능 FROM itemdb WHERE ItemID in (?) ;';

      let recommendItemList = [];

      const recommendUBCF = spawn('python',['./models/UBCF.py']);     

      recommendUBCF.stdout.on('data',function(data){
            console.log("hey: ", data.toString());

            rs = data.toString();   // python파일에서의 print 값
            const searchRegExp1 = new RegExp('\\[', 'g');
            const searchRegExp2 = new RegExp('\\]', 'g');
            rs =  rs.replace(searchRegExp1, '');
            rs =  rs.replace(searchRegExp2, '');

            rsarr = rs.split(/\s+/g);
            console.log("rsarr: ", rsarr);
            rsarr = rsarr.slice(0,-1);
            console.log("rsarr: ", rsarr);
            resultarr =  rsarr.map(Number);

           console.log("hey2: ", resultarr);

            var j = 0;
            itemdb.query(query,[resultarr],function(err,rows){
              if (err){console.error('Error executing second query:',err);}
              else{
                  for (i= 0 ; i < resultarr.length; i++) {
                    if (Object.values(rows[i])){
                    recommendItemList[j]= Object(rows[i]);
                    j++;
                    if (j==resultarr.length){
                      res.send(recommendItemList);
                    }
                  }
                    else{
                      j++;
                    }
    }}})

    });
    recommendUBCF.stderr.on('data', function(data) {
      console.log("222", data.toString());
  });    

});  

app.use('/api/user/:userID/like/:itemID/update',(req,res,next)=>{
  const UID  = req.params.userID;
  const iID = req.params.itemID;
  let itemID = Number(iID);
  let userID = Number(UID);
  const querycheck = 'SELECT * FROM likedb WHERE UID = ?;'
  const query = "UPDATE likedb SET `?` = 0 WHERE UID = ? ;"
  const query1 = "UPDATE likedb SET `?` = 1 WHERE UID = ? ;"
  itemdb.query(querycheck,[userID],function(err,rows){
    //console.log(rows);
    if (!rows[0]){
        likearr = null
    }
    else{
    likearr = Object.values(rows[0]);
    for (i = 0 ; i <likearr.length;i++){
      if (i == itemID){
       // console.log(likearr[itemID])
        if(likearr[i] == 1)
        {
          itemdb.query(query,[itemID,userID]);
        }
      else{
        itemdb.query(query1,[itemID,userID]);
      }}
     }
}})
next()

});

app.get('/api/user/:userID/like', (req, res) => {
    const { userID } = req.params;

    const query = 'SELECT * FROM likedb WHERE UID = ? ;';
    const query2 = 'SELECT item FROM itemdb WHERE ItemID = ?;';
    let userItemlist = [];
    let id = [];
    itemdb.query(query,[userID],function(err,rows) {
      if (err) {
        console.log("데이터 가져오기 실패");
      } else {
        if (!rows[0]){
            likearr = null;
        }
        else{
        likearr = Object.values(rows[0]);
        //console.log('likearr',likearr)
        var j = 0;
        var k = 0;
        for (i= 0 ; i < likearr.length; i++)
        {
        if (likearr[i] == 1){
            id[k]= i
            k++;
            itemdb.query(query2, [i],function(err,rows){
            if (err){console.error('Error executing second query:',err);}
            else{
              userItemlist[j]={itemID:id[j], title: Object.values(rows[0])};
              j++;
              //console.log('k=',k);

              //console.log('j=',j);
              if (j==k){
               // console.log(userItemlist);
                res.send(userItemlist);
             }}
          }
          );}
        }}
}});
})
app.get('/api/user/:userID/like/:itemID', (req, res) => {
  const  UID  = req.params.userID;
  const iID = req.params.itemID;
  console.log('UID',UID)
  console.log('iID',iID)
  let itemID = Number(iID);
  let userID = Number(UID);
  const query = 'SELECT * FROM likedb WHERE UID = ? ;';
  let id = [];
  try{
  itemdb.query(query,[userID],function(err,rows) {
   console.log(rows[0])
    if (!rows[0]) {
        likearr = []
    } else {
      var k = 0;
      //console.log('likedb',rows[0]);
      likearr = Object.values(rows[0]);
      for (i= 0 ; i < likearr.length; i++)
      {if (likearr[i] == 1){
          id[k]= i
          k++;}
        }
     // console.log('itemID: ',itemID);
      for (i = 0 ; i< id.length; i++){
        if( id[i] == itemID ){
          res.send(true);
         // console.log('id[i]:',id[i])
          break
        }
            }
      }}
);}catch(err){
  console.log('err',err);
  }

})


//평점 수정하기
app.use('/api/user/:userID/ratings/:itemID/update/:scores',(req,res,next)=>{
  console.log(req.params)
  const  UID  = req.params.userID;
  const iID = req.params.itemID;
  const myscore = req.params.scores;

  let itemID = Number(iID);
  let userID = Number(UID);
  let score = Number(myscore);
  const query = "UPDATE collabdb SET `?` = ? WHERE UID = ? ;"
  itemdb.query(query,[itemID,score,userID]);

  next()
});

//평점 불러오기
app.get('/api/user/:userID/ratings/:itemID', (req, res) => {

  const  UID  = req.params.userID;
  const iID = req.params.itemID;
  let itemID = Number(iID);
  let userID = Number(UID);
  let k = 0;

  //console.log("fire: ", req);
  //console.log('what: ', res);

    const query = 'SELECT * FROM collabdb WHERE UID = ? ;';
    const query2 = 'SELECT `?` FROM collabdb;'
    itemdb.query(query2,[itemID], function(err,rows){
      if (err){
        console.log("query2 구문 에러");
      }
      else{
        let revnum = 0;
        let scores = Object.values(rows);
        console.log('scores:',scores);
        for (j = 1; j< scores.length;j++){
          let score = Number(Object.values(rows[j]));
        //  console.log('score:',score)

          if (score != 0){
            if (Number(score)>=5){
              k+= 5
            //  console.log('5로 통일')
            }
            else{
              k +=  Number(score);
            }
          //  console.log('k',k)
            revnum ++;

        }
        console.log('out_if_revnum:',revnum);
      }
        aver_score = k/revnum;
     // console.log(aver_score);
        itemdb.query(query,[userID],function(err,rows) {
          if (err) {
            console.log("데이터 가져오기 실패",err);
            res.send([aver_score,0])

          } else {
           // res.send(rows[0]);
           if (! rows[0]){
            res.send([aver_score,0])
           }else{
          //  console.log('Object.values(rows[0]:',Object.values(rows[0]))
            ratings = Object.values(rows[0]);
           for (i = 0; i<ratings.length; i++){
            if(i == itemID){
              user_score = ratings[i]
              res.send([aver_score,user_score])
              break
            }}}} })}})})


//모달창에 보일 ItemBasedCommand 아이템들
app.get('/api/user/IBCF/:itemID', (req, res) => {
  const { itemID } = req.params;
  
 const IBCFList = spawn('python3',['./models/IBCF.py',itemID]);
 const query = 'Select ItemID,item,insta,youtube,맛,맛 상세,재구매의사,목넘김,기능  From itemdb WHERE ItemID in (?);';
 IBCFList.stdout.on('data',function(data){
 //   console.log(data)
    rs = iconv.decode(data, 'euc-kr');
    console.log(rs)
    rsarr = rs.split(/\'|\, |\ |\]|\[/,-1);
    rsarr = rsarr.slice(1,-1);
    resultarr = rsarr.filter(Boolean)
    resultarr =  resultarr.map(Number);

    //console.log(resultarr);


    itemdb.query(query,[resultarr],function(err,rows) {

        console.log('rows:',rows)
        res.send(rows)

    }
  )})
  })

  // 서버 시작
 
