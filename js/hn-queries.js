// Firebase.enableLogging(true);

var ref = new Firebase("https://hndb.firebaseio.com/");
//Datepicker

$('#fromDate').datepicker({
  defaultDate: "-7y",
  changeMonth: true,
  numberOfMonths: 1,
  onClose: function (selectedDate) {
    $('#endDate').datepicker("option", "minDate", selectedDate)
  }
});
$('#endDate').datepicker({
  defaultDate: "-7y",
  changeMonth: true,
  numberOfMonths: 1,
  onClose: function (selectedDate) {
    $('#fromDate').datepicker("option", "maxDate", selectedDate)
  }
});

$('#go').on('click', function (e) {
  $("#intro").text('');
  $('#stories').text('');
  var start = (new Date($('#fromDate').val()).valueOf()) / 1000;
  var end = (new Date($('#endDate').val()).valueOf()) / 1000;
  ref.orderBy('time').startAt(start).endAt(end).on('value', function (snap) {
    var stories = snap.val();
    snap.forEach(function (child) {
      var story = child.val();
      var formattedDate = moment(story.time * 1000).format('MMMM Do, YYYY');
      $('<div class="story"><a href="' + story.url + '">' + story.title + '</a><span> ' + story.score + ' points by <a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a> (<a href="https://news.ycombinator.com/item?id=' + story.id + '">' + story.numComments + ' comments</a>)</span><br/><div>Posted on ' + formattedDate + '</div></div>').prependTo($('#stories'));
    });
    $('#intro').text('Showing stories from ' + $('#fromDate').val() + ' to ' + $('#endDate').val());
  });
});

//Search by stories submitted by a user
$('#search').on('keypress', function (e) {
  if (e.keyCode === 13) {
    ref.off();
    $('.filter').removeClass('isActive');
    $("#intro").text('');
    $('#stories').text('');
    var query = $('#search').val();
    ref.orderByChild('by').equalTo(query).on('value', function (snap) {
      var stories = snap.val();
      snap.forEach(function (child) {
        var story = child.val();
        var formattedDate = moment(story.time * 1000).format('MMMM Do, YYYY');
        $('<div class="story"><a href="' + story.url + '">' + story.title + '</a><span> ' + story.score + ' points by <a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a> (<a href="https://news.ycombinator.com/item?id=' + story.id + '">' + story.numComments + ' comments</a>)</span><br/><div>Posted on ' + formattedDate + '</div></div>').prependTo($('#stories'));
      });
      if (stories === null) {
        $('#intro').text('No stories submitted by ' + query);
      } else {
        $('#intro').text('Showing all stories submitted ' + query);
      }
    });
  }
});

//Filter by points, comments, time or karma
$('.filter').on('click', function(e) {
  ref.off();
  var filter = e.target.id;
  var num = $('#numItems').val();
  $("#intro").text('');
  $('#stories').text('');

  if (!(isNaN(num))) {
    ref.orderByChild(filter).limitToLast(parseInt(num)).on('value', function (snap) {
      snap.forEach(function (child) {
        var story = child.val();
        var formattedDate = moment(story.time * 1000).format('MMMM Do, YYYY');
        $('<div class="story"><a href="' + story.url + '">' + story.title + '</a><span> ' + story.score + ' points by <a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a> (<a href="https://news.ycombinator.com/item?id=' + story.id + '">' + story.numComments + ' comments</a>)</span><br/><div>Posted on ' + formattedDate + '</div></div>').prependTo($('#stories'));
      });
      $('.filter').addClass('inActive');
      $('#' + filter).removeClass('inActive').addClass('isActive');
      $('#intro').text('Showing the top ' + num + ' stories by ' + ($(e.target).text()).toLowerCase());
    });
  } else {
    alert('Please enter a number');
  }
});


//Filter by stories starting with selected term
$('#query').on('keypress', function (e) {
  if (e.keyCode === 13) {
    var query = $('#query').val();
    $('.filter').removeClass('isActive');
    $("#intro").text('');
    $('#stories').text('');
    ref.orderByChild('title').startAt(query).endAt(query + '~').on('value', function (snap) {
      snap.forEach(function (child) {
        var story = child.val();
        var formattedDate = moment(story.time * 1000).format('MMMM Do, YYYY');
        $('<div class="story"><a href="' + story.url + '">' + story.title + '</a><span> ' + story.score + ' points by <a href="https://news.ycombinator.com/user?id=' + story.by + '">' + story.by + '</a> (<a href="https://news.ycombinator.com/item?id=' + story.id + '">' + story.numComments + ' comments</a>)</span><br/><div>Posted on ' + formattedDate + '</div></div>').prependTo($('#stories'));
      });
      $('#intro').text("Showing all stories starting with '" + query + "'");
    });
  }
});

// ref.orderByKey().startAt("1").endAt("2").on('value', function (snap) {
//   console.log(snap.val());
// });