var Firebase = require("firebase");

var ref = new Firebase("https://hacker-news.firebaseio.com/v0/");
var itemRef = ref.child("item");
var userRef = ref.child('user');
var lastItem = null;

var hnRef = new Firebase("https://hndb.firebaseio.com/");

// //Get latest story
// ref.child("maxitem").once('value', function (snap) {
//   var lastItem = snap.val();
// });

var getStory = function(id) {
  itemRef.child(id).once('value', function (snap) {
    var item = snap.val();
    if (item.type === 'story') {
      console.log("found story" + id);

      hnRef.child(item.id).set(item);

      if (item.kids) {
        hnRef.child(item.id).child('numComments').set(item.kids.length);
      } else {
        hnRef.child(item.id).child('numComments').set(0);
      }

      //get user karma
      userRef.child(item.by).once('value', function (snapshot) {
        var userKarma = snapshot.val().karma;
        hnRef.child(item.id).child('userKarma').set(userKarma);
      });
    }
    if (id !== 8000000) {
      getStory(id + 1);
    }
  }, function (error) {
    console.log(error.code);
    getStory(id + 1);
  });
};

getStory(1125584);

// for (var i = 500001; i <= 8000000; i++) {
//   console.log(i);
//   itemRef.child(i).on('value', function (snap) {
//     var item = snap.val();
//     if (item.type === 'story') {
//       console.log("found story" + i);
//       hnRef.child(item.id).set(item);

//       if (item.kids) {
//         hnRef.child(item.id).child('numComments').set(item.kids.length);
//       } else {
//         hnRef.child(item.id).child('numComments').set(0);
//       }

//       //get user karma
//       userRef.child(item.by).on('value', function (snapshot) {
//         var userKarma = snapshot.val().karma;
//         hnRef.child(item.id).child('userKarma').set(userKarma);
//       });
//     }
//   });
// }