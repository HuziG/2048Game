// 监听事件（键盘、手势）
function handle(direction) {
	let dom = handleDomData(direction)
	let newdom = []
	let _mdirection = direction

	if (_mdirection === 'bottom') {
		_mdirection = 'right'
	}

	if (_mdirection === 'top') {
		_mdirection = 'left'
	}

	dom.forEach(item => {
		newdom.push(handleMoving(item, _mdirection))
	})

	handleMoveAfter(newdom, direction)
}

// 获取dom转为数据
function handleDomData(direction) {
	let domarr = $('.box-wrapper div')
	let _domarr = []
	let __domarr = []


	for (let i = 0 ; i < domarr.length; i++) {
		_domarr.push(Number(domarr.eq(i).text()))
	}

	if (direction === 'left' || direction === 'right') {
		for(let j = 0; j <= 3; j++){
		    __domarr.push(_domarr.splice(0, 4))
		}
	}

	if (direction === 'top' || direction === 'bottom') {
		for (let i = 0 ; i <= 3 ; i++) {
			let a = []
			for (let j = i ; j <= i+12 ; j+=4) {
				a.push(_domarr[j])
			}
			__domarr.push(a)
		}
	}

	return __domarr
}

// 移动数据操作
function handleMoving(arr, direction) {
	let _arr = arr

	if (direction === 'right') {
		_arr = _arr.reverse()
	}

	_arr = _arr.reduce((total, currentValue, currentIndex, array) => {
		if (currentValue != 0) {
			total.push(currentValue)
		}
		return total
	}, [])
	_arr.map((item, index, array) => {
		if (item === array[index + 1]) {
			array[index] = item + array[index + 1]
			array[index + 1] = 0
		}
		return array
	})
	_arr = _arr.reduce((total, currentValue, currentIndex, array) => {
		if (currentValue != 0) {
			total.push(currentValue)
		}
		return total
	}, [])

	while(_arr.length < 4) {
		_arr.push(0)
	}

	if (direction === 'right') {
		return _arr.reverse()
	}

	return _arr
}

// 移动后组成
function handleMoveAfter(arr, direction) {
	let _arr = []
	if (direction === 'left' || direction === 'right') {
		_arr = arrayToFloor(arr)
	}

	if (direction === 'top' || direction === 'bottom') {
		for (let i = 0 ; i <= 3 ; i++) {
			let a = []
			for (let j = 0 ; j <= 3 ; j++) {
				a.push(arr[j][i])
			}
			_arr.push(a)
		}
		_arr = arrayToFloor(_arr)
	}

	arr = handleRandomCreate(_arr)

	handleRenderDom(arr)

	function arrayToFloor(array) {
		let _array = array.reduce((total, currentValue, currentIndex, array) => {
			return total.concat([...currentValue])
		}, [])

		return _array
	}
}

// 随机2生成
function handleRandomCreate(arr) {
	let indexArr = arr.reduce((total, currentValue, currentIndex, array) => {
		if (currentValue === 0) {
			total.push(currentIndex)
		}
		return total
	},[])

	let random = indexArr[Math.floor(Math.random() * indexArr.length)]

	arr[random] = 2

	return arr
}

// dom渲染
function handleRenderDom(value) {
	let boxWrapper = $('.box-wrapper')
	boxWrapper.empty()

	for (let i = 0 ; i < value.length ; i++) {
		boxWrapper.append('<div class="value'+value[i]+'">'+value[i]+'</div>')
	}
}

// 游戏结束
function handleGameFinish(arr) {
	let _arr = arr.reduce((total, currentValue, currentIndex, array) => {
		return total.concat([...currentValue])
	}, [])

	console.log(_arr.indexOf(0) === -1)
}

document.onkeydown = e => {
	switch(e.keyCode) {
		case 38: 
			handle('top')
			return
		case 40: 
			handle('bottom')
			return
		case 37: 
			handle('left')
			return 
		case 39: 
			handle('right')
			return
	}
} 