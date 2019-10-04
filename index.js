var maxScore;
var curScore = 0

handleInit()

// 游戏初始化
function handleInit() {
  tableInit()

  handleSetGameScore('refresh')

  function tableInit() {
    $(".box-wrapper").empty();
    for (let i = 0; i <= 15; i++) {
      $(".box-wrapper").append('<div class="value0">0</div>');
    }

    let randomArr = [];
    while (randomArr.length < 2) {
      let index = Math.floor(Math.random() * 15);
      if (randomArr.indexOf(index) === -1) {
        randomArr.push(index);
      }
    }

    for (let i = 0; i <= 1; i++) {
      $(".box-wrapper div")
        .eq(randomArr[i])
        .replaceWith('<div class="value2">2</div>');
    }
  }
}

// 方向机制
function handle(direction) {
  let dom = "";
  dom = handleDomData(direction);
  let newdom = [];
  let _mdirection = direction;

  if (_mdirection === "bottom") {
    _mdirection = "right";
  }

  if (_mdirection === "top") {
    _mdirection = "left";
  }

  dom.forEach(item => {
    newdom.push(handleMoving(item, _mdirection));
  });

  handleMoveAfter(newdom, direction);
}

// 获取dom转为数据
function handleDomData(direction) {
  let domarr = $(".box-wrapper div");
  let _domarr = [];
  let __domarr = [];

  for (let i = 0; i < domarr.length; i++) {
    _domarr.push(Number(domarr.eq(i).text()));
  }

  top.startDomarr = JSON.parse(JSON.stringify(_domarr));

  if (direction === "left" || direction === "right") {
    for (let j = 0; j <= 3; j++) {
      __domarr.push(_domarr.splice(0, 4));
    }
  }

  if (direction === "top" || direction === "bottom") {
    for (let i = 0; i <= 3; i++) {
      let a = [];
      for (let j = i; j <= i + 12; j += 4) {
        a.push(_domarr[j]);
      }
      __domarr.push(a);
    }
  }

  return __domarr;
}

// 移动数据操作
function handleMoving(arr, direction) {
  let _arr = arr;

  if (direction === "right") {
    _arr = _arr.reverse();
  }

  _arr = _arr.reduce((total, currentValue, currentIndex, array) => {
    if (currentValue != 0) {
      total.push(currentValue);
    }
    return total;
  }, []);
  _arr.map((item, index, array) => {
    if (item === array[index + 1]) {
      let sum = item + array[index + 1];

      handleSetGameScore('add',sum)

      if (sum === 2048) {
        handleGameWin()
      }

      array[index] = sum;
      array[index + 1] = 0;
    }
    return array;
  });
  _arr = _arr.reduce((total, currentValue, currentIndex, array) => {
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
  let _arr = [];
  if (direction === "left" || direction === "right") {
    _arr = arr.myArrayFloor();
  }

  if (direction === "top" || direction === "bottom") {
    for (let i = 0; i <= 3; i++) {
      let a = [];
      for (let j = 0; j <= 3; j++) {
        a.push(arr[j][i]);
      }
      _arr.push(a);
    }
    _arr = _arr.myArrayFloor();
  }
  arr = handleRandomCreate(_arr);
  handleRenderDom(arr);
}

// 随机2生成
function handleRandomCreate(arr) {
  let indexArr = arr.reduce((total, currentValue, currentIndex, array) => {
    if (currentValue === 0) {
      total.push(currentIndex);
    }
    return total;
  }, []);

  let random = indexArr[Math.floor(Math.random() * indexArr.length)];

  arr[random] = 2;

  return arr;
}

// dom渲染
function handleRenderDom(value) {
  let animatearr = handleAnimate(value);
  let boxWrapper = $(".box-wrapper");
  boxWrapper.empty();

  for (let i = 0; i < value.length; i++) {
    let ani = "";
    if (animatearr.indexOf(i) != -1) {
      ani += "bounceIn-do";
    }
    boxWrapper.append(
      `<div class="value${value[i]} ${ani}">${value[i]}</div>`
    );
  }

  handleGameFinish();
}

// 合成动画执行
function handleAnimate(arr) {
  let arr1 = top.startDomarr;
  let arr2 = arr;
  let rarr = [];
  arr2.forEach((item, index) => {
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
  let domarr = $(".box-wrapper div");
  let _domarr = [];
  let failLock = 0;

  for (let i = 0; i < domarr.length; i++) {
    _domarr.push(Number(domarr.eq(i).text()));
  }

  if (_domarr.indexOf(0) === -1) {
    checkAccessMoveRow(_domarr);
    checkAccessMoveColumn(_domarr);

    if (failLock === 8) {
      setTimeout(function() {
        $('.gameover-wrapper').fadeIn()
        handleSetGameScore('setmax',curScore)
      }, 100);
    }
  }

  // 横向检查
  function checkAccessMoveRow(arr) {
    let _arr = JSON.parse(JSON.stringify(arr));
    let _d = [];
    for (let j = 0; j <= 3; j++) {
      _d.push(_arr.splice(0, 4));
    }
    checkArr(_d);
  }

  // 纵向检查
  function checkAccessMoveColumn(arr) {
    let _arr = JSON.parse(JSON.stringify(arr));
    let _d = [];

    for (let i = 0; i <= 3; i++) {
      let a = [];
      for (let j = 0; j <= 3; j++) {
        a.push(_arr[i + j * 4]);
      }
      _d.push(a);
    }

    checkArr(_d);
  }

  // 检查操作
  function checkArr(arr) {
    for (let i = 0; i <= 3; i++) {
      let afterarr = [];
      arr[i].forEach((item, index) => {
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

// 合计分数
function handleSetGameScore(mode, value) {
  maxScore = localStorage.getItem('max_score') || 0

  if (mode === 'add') {
    curScore = curScore + value
    if (maxScore === 0) {
      $('#max-score-counter').text(curScore)
    }
    if (curScore >= maxScore) {
      $('#max-score-counter').text(curScore)
    }
    $('#score-counter').text(curScore)
  }

  if (mode === 'refresh') {
    curScore = 0
    $('#score-counter').text(0)
    $('#max-score-counter').text(maxScore)
  }

  if (mode === 'setmax') {
    if (value >= maxScore) {
      localStorage.setItem('max_score', value)
    }
  }
}

// 游戏成功
function handleGameWin() {
  $('.gamewin-wrapper').fadeIn()
}

// 监听事件（键盘、手势）
document.onkeydown = e => {
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

$("#refresh-but").on("click", () => {
  handleInit();
});

$('#try-again-but').on('click', () => {
  $('.gameover-wrapper').fadeOut()
  handleInit()
})

$('#restart-but').on('click', () => {
  $('.gamewin-wrapper').fadeOut()
  handleInit()
})

// 定义数组拍平
Array.prototype.myArrayFloor = function() {
  if (this.lenght === 0) {
    return this;
  }
  let _array = this.reduce((total, currentValue, currentIndex, array) => {
    return total.concat([...currentValue]);
  }, []);

  return _array;
};
