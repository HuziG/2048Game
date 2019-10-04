window.onload = function() {
  // 游戏初始化
  handleInit()

  function handleInit() {
    $(".box-wrapper").empty();
    for (var i = 0; i <= 15; i++) {
      $(".box-wrapper").append('<div class="value0">0</div>');
    }

    var randomArr = [];
    while (randomArr.length < 2) {
      var index = Math.floor(Math.random() * 15);
      if (randomArr.indexOf(index) === -1) {
        randomArr.push(index);
      }
    }

    for (var i = 0; i <= 1; i++) {
      $(".box-wrapper div")
        .eq(randomArr[i])
        .replaceWith('<div class="value2">2</div>');
    }

    // $.cookie('game_state', $(".box-wrapper").html());
  }

  function handle(direction) {
    var dom = "";
    dom = handleDomData(direction);
    var newdom = [];
    var _mdirection = direction;

    if (_mdirection === "bottom") {
      _mdirection = "right";
    }

    if (_mdirection === "top") {
      _mdirection = "left";
    }

    dom.forEach(function(item) {
      newdom.push(handleMoving(item, _mdirection));
    });

    handleMoveAfter(newdom, direction);
  }

  // 获取dom转为数据
  function handleDomData(direction) {
    var domarr = $(".box-wrapper div");
    var _domarr = [];
    var __domarr = [];

    for (var i = 0; i < domarr.length; i++) {
      _domarr.push(Number(domarr.eq(i).text()));
    }

    top.startDomarr = JSON.parse(JSON.stringify(_domarr));

    if (direction === "left" || direction === "right") {
      for (var j = 0; j <= 3; j++) {
        __domarr.push(_domarr.splice(0, 4));
      }
    }

    if (direction === "top" || direction === "bottom") {
      for (var i = 0; i <= 3; i++) {
        var a = [];
        for (var j = i; j <= i + 12; j += 4) {
          a.push(_domarr[j]);
        }
        __domarr.push(a);
      }
    }

    return __domarr;
  }

  // 移动数据操作
  function handleMoving(arr, direction) {
    var _arr = arr;

    if (direction === "right") {
      _arr = _arr.reverse();
    }

    _arr = _arr.reduce(function(total, currentValue, currentIndex, array) {
      if (currentValue != 0) {
        total.push(currentValue);
      }
      return total;
    }, []);
    _arr.map(function(item, index, array) {
      if (item === array[index + 1]) {
        array[index] = item + array[index + 1];
        array[index + 1] = 0;
      }
      return array;
    });
    _arr = _arr.reduce(function(total, currentValue, currentIndex, array) {
      if (currentValue != 0) {
        total.push(currentValue);
      }
      return total;
    }, []);

    while (_arr.length < 4) {
      _arr.push(0);
    }

    if (direction === "right") {
      return _arr.reverse();
    }

    return _arr;
  }

  // 移动后组成
  function handleMoveAfter(arr, direction) {
    var _arr = [];
    if (direction === "left" || direction === "right") {
      _arr = arr.myArrayFloor();
    }

    if (direction === "top" || direction === "bottom") {
      for (var i = 0; i <= 3; i++) {
        var a = [];
        for (var j = 0; j <= 3; j++) {
          a.push(arr[j][i]);
        }
        _arr.push(a);
      }
      _arr = _arr.myArrayFloor();
      console.log(_arr);
    }
    arr = handleRandomCreate(_arr);
    handleRenderDom(arr);
  }

  // 随机2生成
  function handleRandomCreate(arr) {
    var indexArr = arr.reduce(function(total, currentValue, currentIndex, array) {
      if (currentValue === 0) {
        total.push(currentIndex);
      }
      return total;
    }, []);

    var random = indexArr[Math.floor(Math.random() * indexArr.length)];

    arr[random] = 2;

    return arr;
  }

  // dom渲染
  function handleRenderDom(value) {
    var animatearr = handleAnimate(value);
    var boxWrapper = $(".box-wrapper");
    boxWrapper.empty();

    for (var i = 0; i < value.length; i++) {
      var ani = "";
      if (animatearr.indexOf(i) != -1) {
        ani += "bounceIn-do";
      }
      boxWrapper.append(
        '<div class="value'+value[i]+' '+ani+'">'+value[i]+'</div>'
      );
    }

    // $.cookie('game_state', $(".box-wrapper").html());

    handleGameFinish();
  }

  // 合成动画执行
  function handleAnimate(arr) {
    var arr1 = top.startDomarr;
    var arr2 = arr;
    var rarr = [];
    arr2.forEach(function(item, index) {
      if (
        (arr2[index] - arr1[index] >= 2 && arr1[index] != 0) ||
        (arr2[index] - arr1[index] >= 4 && arr1[index] === 0)
      ) {
        rarr.push(index);
      }
    });
    return rarr;
  }

  // 游戏结束
  function handleGameFinish() {
    var domarr = $(".box-wrapper div");
    var _domarr = [];
    var failLock = 0;

    for (var i = 0; i < domarr.length; i++) {
      _domarr.push(Number(domarr.eq(i).text()));
    }

    if (_domarr.indexOf(0) === -1) {
      console.log("start finish handle game");

      checkAccessMoveRow(_domarr);
      checkAccessMoveColumn(_domarr);

      if (failLock === 8) {
        console.log("game over");
      }
    }

    function checkAccessMoveRow(arr) {
      var _arr = JSON.parse(JSON.stringify(arr));
      var _d = [];
      for (var j = 0; j <= 3; j++) {
        _d.push(_arr.splice(0, 4));
      }
      checkArr(_d);
    }

    function checkAccessMoveColumn(arr) {
      var _arr = JSON.parse(JSON.stringify(arr));
      var _d = [];

      for (var i = 0; i <= 3; i++) {
        var a = [];
        for (var j = 0; j <= 3; j++) {
          a.push(_arr[i + j * 4]);
        }
        _d.push(a);
      }

      checkArr(_d);
    }

    function checkArr(arr) {
      for (var i = 0; i <= 3; i++) {
        var afterarr = [];
        arr[i].forEach(function(item, index) {
          if (item != arr[i][index - 1]) {
            afterarr.push(item);
          }
        });

        if (arr[i].join("") === afterarr.join("")) {
          failLock += 1;
        }
      }
    }
  }

  // 监听事件（键盘、手势）
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 38:
        handle("top");
        return;
      case 40:
        handle("bottom");
        return;
      case 37:
        handle("left");
        return;
      case 39:
        handle("right");
        return;
    }
  };

  $("#refresh-but").on("click", function() {
    handleInit();
  });

  // 定义数组拍平
  Array.prototype.myArrayFloor = function() {
    if (this.lenght === 0) {
      return this;
    }
    var _array = this.reduce(function(total, currentValue, currentIndex, array) {
      var a = []
      currentValue.forEach(function(item) {
        a.push(item)
      })
      return total.concat(a);
    }, []);

    return _array;
  };
};
