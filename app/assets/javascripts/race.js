// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(function() {

  // start race music
  var raceMusic = document.createElement("audio");
  raceMusic.src = "http://66.90.93.122/ost/crash-team-racing/bamptppn/12.%20Boss%20Race.mp3";
  raceMusic.volume = 1;
  raceMusic.preLoad = false;
  raceMusic.controls = true;
  raceMusic.loop = true;
  raceMusic.play();

  // crash music
  var crashMusic = document.createElement("audio");
  crashMusic.src = "http://www.noiseaddicts.com/samples_1w72b820/3733.mp3";
  crashMusic.volume = 1;
  crashMusic.preLoad = false;
  crashMusic.controls = true;

  $.ajaxSetup({
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))}
  });
  var animationId;

  //saving dom objects to variables
  var road = $('#road');
  var car = $('#car');
  var car1 = $('#car_1');
  var car2 = $('#car_2');
  var car3 = $('#car_3');
  var whiteLine1 = $('#white_line_1');
  var whiteLine2 = $('#white_line_2');
  var whiteLine3 = $('#white_line_3');
  var restartSection = $('#restart_section');
  var restartBtn = $('#restart');
  var score = $('#score');
  var finalScore = $('#final_score');

  //saving some initial setup
  var roadWidth = parseInt(road.width());
  var roadHeight = parseInt(road.height());
  var carWidth = parseInt(car.width());
  var carHeight = parseInt(car.height());

  //some other declarations
  var gameOver = false;
  var moveRight = false;
  var moveLeft = false;
  var moveUp = false;
  var moveDown = false;
  var scoreCounter = 1;
  var speed = 2;
  var whiteLineSpeed = 5;

  /* Move the cars */
  $(document).on('keydown', function(e) {
    if (gameOver === false) {
      var key = e.keyCode;
      if (key === 37 && moveLeft === false) {
        moveLeft = requestAnimationFrame(left);
      } else if (key === 39 && moveRight === false) {
        moveRight = requestAnimationFrame(right);
      } else if (key === 38 && moveUp === false) {
        moveUp = requestAnimationFrame(up);
      } else if (key === 40 && moveDown === false) {
        moveDown = requestAnimationFrame(down);
      }
    }
  });

  $(document).on('keyup', function(e) {
    if (gameOver === false) {
      var key = e.keyCode;
      if (key === 37) {
        cancelAnimationFrame(moveLeft);
        moveLeft = false;
      } else if (key === 39) {
        cancelAnimationFrame(moveRight);
        moveRight = false;
      } else if (key === 38) {
        cancelAnimationFrame(moveUp);
        moveUp = false;
      } else if (key === 40) {
        cancelAnimationFrame(moveDown);
        moveDown = false;
      }
    }
  });

  function left() {
    if (gameOver === false && parseInt(car.css('left')) > 0) {
      car.css('left', parseInt(car.css('left')) - 5);
      moveLeft = requestAnimationFrame(left);
    }
  }

  function right() {
    if (gameOver === false && parseInt(car.css('left')) < roadWidth - carWidth) {
      car.css('left', parseInt(car.css('left')) + 5);
      moveRight = requestAnimationFrame(right);
    }
  }

  function up() {
    if (gameOver === false && parseInt(car.css('top')) > 0) {
      car.css('top', parseInt(car.css('top')) - 3);
      moveUp = requestAnimationFrame(up);
    }
  }

  function down() {
    if (gameOver === false && parseInt(car.css('top')) < roadHeight - carHeight) {
      car.css('top', parseInt(car.css('top')) + 3);
      moveDown = requestAnimationFrame(down);
    }
  }

  /* Move the cars and lines */
  animationId = requestAnimationFrame(repeat);

  function repeat() {
    if (detectCollision(car, car1) || detectCollision(car, car2) || detectCollision(car, car3)) {
      finalScore.text(parseInt(score.text()));
      raceOver();
      return;
    }
    scoreCounter++;

    if (scoreCounter % 20 == 0) {
      score.text(parseInt(score.text()) + 1);
    }
    if (scoreCounter % 500 == 0) {
      speed++;
      whiteLineSpeed++;
    }

    moveCar(car1);
    moveCar(car2);
    moveCar(car3);

    moveWhiteLine(whiteLine1);
    moveWhiteLine(whiteLine2);
    moveWhiteLine(whiteLine3);

    animationId = requestAnimationFrame(repeat);
  }

  function moveCar(car) {
    var carCurrentTop = parseInt(car.css('top'));
    if (carCurrentTop > roadHeight) {
      carCurrentTop = -200;
      var car_left = parseInt(Math.random() * (roadWidth - carWidth));
      car.css('left', car_left);
    }
    car.css('top', carCurrentTop + speed);
  }

  function moveWhiteLine(line) {
    var lineCurrentTop = parseInt(line.css('top'));
    if (lineCurrentTop > roadHeight) {
      lineCurrentTop = -300;
    }
    line.css('top', lineCurrentTop + whiteLineSpeed);
  }

  function raceOver() {
    gameOver = true;
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(moveRight);
    cancelAnimationFrame(moveLeft);
    cancelAnimationFrame(moveUp);
    cancelAnimationFrame(moveDown);
    raceMusic.pause();
    crashMusic.play();
    restartSection.slideDown();
    restartBtn.focus();
  }

  function detectCollision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

  restartBtn.click(function() {
    location.reload();
  });

  var submitScoreForm = $('#submit_score');

  submitScoreForm.submit(function(e) {
    var ScorerName = submitScoreForm.find('input[name="ScorerName"]').val();
    var finalScoreCount = parseInt(score.text());

    $.ajax({
      type: submitScoreForm.attr('method'),
      url: submitScoreForm.attr('action'),
      dataType: 'json',
      data: {
        'score': {
          'score_count': finalScoreCount,
          'name': ScorerName
        }
      },
      success: function (data) {
        window.location = data.location;
      }
    });
    e.preventDefault();
    return false;
  });
});