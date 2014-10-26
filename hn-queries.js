var ref = new Firebase("https://hndb.firebaseio.com/");

//Search by user
$('#search').on('keypress', function (e) {
  if (e.keyCode === 13) {
    $('#stories').text('');
    var query = $('#search').val();
    ref.orderBy('by').equalTo(query).on('value', function (snap) {
      var stories = snap.val();
      snap.forEach(function (child) {
        var story = child.val();
        var formattedDate = moment(story.time * 1000).format('MMMM Do, YYYY');
        $('<div class="story"><a href="' + story.url + '">' + story.title + '</a><span> ' + story.score + ' points by ' + story.by + ' (' + story.numComments + ' comments)</span><br/><div>Posted on ' + formattedDate + '</div></div>').prependTo($('#stories'));
      });
    });
  }
});

$('.filter').on('click', function(e) {
  var filter = e.target.id;
  var num = $('#numItems').val();
  $('#stories').text('');
  if (!(isNaN(num))) {
    ref.orderBy(filter).limitToLast(parseInt(num)).on('value', function (snap) {
      snap.forEach(function (child) {
        var story = child.val();
        var formattedDate = moment(story.time * 1000).format('MMMM Do, YYYY');
        $('<div class="story"><a href="' + story.url + '">' + story.title + '</a><span> ' + story.score + ' points by <a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a> (<a href="https://news.ycombinator.com/item?id=' + story.id + '">' + story.numComments + ' comments</a>)</span><br/><div>Posted on ' + formattedDate + '</div></div>').prependTo($('#stories'));
      });
    });
  } else {
    alert('Please enter a number');
  }
});