// 监听事件（键盘、手势）

document.onkeydown = e => {
	switch(e.keyCode) {
		case 38: 
			console.log('up')
			return
		case 40: 
			console.log('down')
			return
		case 37: 
			console.log('left')
			return 
		case 39: 
			console.log('right')
			return
	}
} 