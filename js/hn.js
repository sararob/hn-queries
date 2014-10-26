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

for (var i = 200001; i <= 500000; i++) {
  itemRef.child(i).on('value', function (snap) {
    var item = snap.val();
    if (item.type === 'story') {
      // hnRef.child(item.id).set(item);

      // if (item.kids) {
      //   hnRef.child(item.id).child('numComments').set(item.kids.length);
      // } else {
      //   hnRef.child(item.id).child('numComments').set(0);
      // }

      //get user karma
      userRef.child(item.by).on('value', function (snapshot) {
        var userKarma = snapshot.val().karma;
        hnRef.child(item.id).child('userKarma').set(userKarma);
      });
    }
  });
}