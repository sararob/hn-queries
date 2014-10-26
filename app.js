//create divs for each story
for (var i = 0; i <= 99; i++) {
  $('<div id="' + i + '">').appendTo($('#stories'));
}

var ref = new Firebase("https://hacker-news.firebaseio.com/v0/");
var topRef = new Firebase("https://hn-queries.firebaseio.com/");
ref.child('topstories').on('value', function (snapshot) {
  var stories = snapshot.val();
  for (var story in stories) {
    var itemRef = ref.child('item').child(stories[story]);
    itemRef.on('value', function (snap) {
      var item = snap.val();
      topRef.child(story).set(item);
      var numComments;
      if (item.kids !== undefined) {
        numComments = item.kids.length;
      } else {
        numComments = 0;
      }
      topRef.child(story).child('comments').set(numComments);
      $('#' + story).text(item.title).appendTo($('#stories'));

      var userRef = ref.child('user').child(item.by);
      userRef.on('value', function (user) {
        var userKarma = user.val().karma;
        topRef.child(story).child('userKarma').set(userKarma);
      });
    });
  }
});

$('#points').on('click', function(e) {
  e.preventDefault();
  topRef.orderBy('score').on('child_added', function (data) {
    console.log(data.val());
  });
});

$('#time').on('click', function(e) {
  e.preventDefault();
  topRef.orderBy('time').on('child_added', function (data) {
    console.log(data.val());
  });
});

$('#comments').on('click', function(e) {
  e.preventDefault();
  topRef.orderBy('comments').on('child_added', function (data) {
    console.log(data.val());
  });
});

$('#show').on('click', function(e) {
  e.preventDefault();
  topRef.orderBy('title').startAt('Show HN').endAt('Show HN~').on('child_added', function (data) {
    var showStories = data.val();
    console.log(showStories);
    // $('#stories').empty();
    // var count = 0;
    // for (var story in showStories) {
    //   $('#' + count).text(showStories[story].title).appendTo($('#stories'));
    //   count += 1;
    // }
  });
});

$('#karma').on('click', function(e) {
  e.preventDefault();
  topRef.orderBy('userKarma').on('child_added', function (data) {
    console.log(data.val());
  });
});

$('#search').on('keyup', function (e) {
    var query = $('#search').val();
    console.log(query);
    var lastChar = query.substr(query.length - 1);
    var nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
    topRef.orderBy('by').startAt(query).endAt(query + '~').limitToFirst(10).on('child_added', function (snap) {
      console.log(snap.val());
    });
});
