const scenarioObject = function () {
    this.keys = ['start', 'init', 'pixelDescript', 'pixelDescript_2', 'pixelDescript_3', 'bainaryDescript', 'bainaryDescript_2', 'bainaryDescript_3', 'bainaryDescript_4', 'bainaryDescript_5', 'dilationDescript', 'dilationDescript_2', 'dilationDescript_3', 'dilationDescript_4', 'dilationDescript_5_check', 'dilationDescript_5_cardinal', 'dilationDescript_6', 'dilation_skip', 'end', 'blank'];

    this.next = (key) => {

        if(key) {
            if (this.items[key]) {
                this.current = this.items[key];
                msg.innerHTML = this.current.text;
                this.current.initCbk();
            } else {
                this.current = null;
            }
        }

        else {
            let key = this.keys.shift();
            if (this.items[key]) {
                this.current = this.items[key];
                msg.innerHTML = this.current.text;
                this.current.initCbk();
            } else {
                this.current = null;
            }
        }

    };

    document.getElementById('pop_btn').onclick = () => {
        if(this.current) {
            this.current.btnCbk();
        }
    }

    this.current = null;

    this.items = {
        'start': {
            text: '안녕하세요! <br>Snaps CV의 2가지 기능을 알려드릴게요!!<br>다음을 눌러주세요',
            initCbk: () => {

            },
            btnCbk: () => {
                popup.classList.remove('active');
                view.classList.add('active');

                setTimeout(() => {
                    this.next()
                }, 500)
            }
        },

        'init': {
            text: '첫번 째는 <span style="color: deepskyblue">픽셀투명도 바이너리화</span> 입니다.<br>화면에 보여지는 이미지를 통해서<br>기능을 설명하겠습니다',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                arrow.classList.add('active');

                setTimeout(() => {
                    this.next()
                }, 1500)
            }
        },

        'pixelDescript': {
            text: '화살표가 가르키고 있는 <span style="color: rgb(237, 172, 177)">분홍색 사각형</span>과 같은 블록들을<br>픽셀이라고 부르고 이러한 픽셀들이 모여서<br>하나의 이미지를 이룹니다.',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                this.next();
            }
        },

        'pixelDescript_2': {
            text: '각 픽셀 별로 투명도와 색의 정보를 가지고 있습니다.<br>색은 빨강(R), 초록색(G), 파랑색(B)을 가지며<br>각 요소들은 0~255의 수치를 가지고 있습니다.<br>예를 들면 <span style="color: red">237</span>, <span style="color: green">172</span>, <span style="color: blue">177</span>, <span style="color: rgba(0,0,0,0.3)">76(투명도)</span> 이와 같은 값을<br>가지고 있습니다.',
            initCbk: () => {

            },
            btnCbk: () => {
                this.next();
            }
        },

        'pixelDescript_3': {
            text: 'SnapsCV에서의 픽셀투명도 바이너리화는 이러한 픽셀들의 <br><span style="color: deepskyblue">투명도 값이 125이상</span>인 경우<br>이미지의 값이 있다고 판단합니다.<br>직접 보시죠!',
            initCbk: () => {

            },
            btnCbk: () => {
                popup.classList.remove('active');
                arrow.classList.remove('active');
                execute();
            }
        },

        'bainaryDescript': {
            text: '이미지 오른쪽에 현재 선택 된 픽셀의 색상 정보와<br>투명도의 값이 표시 되어있습니다. ',
            initCbk: () => {
                parameter.classList.add('active');
                popup.classList.add('active');
                arrow.classList.add('active');
            },
            btnCbk: () => {
                parameter.classList.remove('active');
                this.next();
            }
        },

        'bainaryDescript_2': {
            text: '지금 점멸하고 있는 픽셀의 부분의 투명도의 값이 125보다 <br>높기때문에 이 부분은 값이 있다고 판단하여<br>체크를 하게 됩니다. <br> 이번엔 끝까지 다 칠해보겠습니다. <br>(연두색으로 칠하겠습니다.)',
            initCbk: () => {

            },
            btnCbk: () => {
                popup.classList.remove('active');
                arrow.classList.remove('active');

                toggle();
                execute();

                setTimeout(()=> {
                    this.next();
                }, 5000)
            }
        },

        'bainaryDescript_3': {
            text: '칠해야 할 양이 많아 지루할 수 있기때문에 끝까지 <br>칠하는 것은 스킵하도록 하겠습니다!',
            initCbk: () => {
                popup.classList.add('active');
                binary.stop();
            },
            btnCbk: () => {
                binary.skip();
                popup.classList.remove('active');

                setTimeout(() => {
                    this.next();
                }, 500);
            }
        },

        'bainaryDescript_4': {
            text: '이렇게 <span style="color: red;">투명도의 값이 125이상인 부분만</span> <br>칠하게 되면 이러한 느낌이 됩니다!<br>이것으로 픽셀투명도 바이너리화가 완성 됩니다.',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                this.next();
            }
        },

        'bainaryDescript_5': {
            text: '실제 데이터는 1차원 배열 형식으로 [0, 0, 0, 0, 1, 1, 1, 0...]<br> 이러한 포맷의 데이터가 만들어지게 됩니다. <br>(0은 칠하지 않은 곳, 1은 칠한 곳<br> 실제 데이터를 보고 싶다면 개발자 툴을 열어<br> 콘솔창을 확인 해주세요.)',
            initCbk: () => {
                popup.classList.add('active');
                console.log('바이너리화 한 실제 데이터: ', dil.binarizationArray);
            },
            btnCbk: () => {
                popup.classList.remove('active');
                this.next();
            }
        },

        'dilationDescript': {
            text: '다음으로는 두번 째 <span style="color: deepskyblue">칼선 추가</span>에 대해서 알아보겠습니다.',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                this.next();
            }
        },

        'dilationDescript_2': {
            text: '시작 전에 간단히 설명 드리자면, 원을 생성하여 바이너리화한 데이터 중 가장 바깥쪽 픽셀을 기준으로 원을 그립니다. <br>실제로 보도록 하죠!',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                this.next();
            }
        },

        'dilationDescript_3': {
            text: `먼저 반지름을 지정하여 원의 방정식을 통해 원을 생성 합니다. (임의의 반지름 값: ${radius}) <br> (원의 중심이 (a, b)이고 반지름이 r인<br> 원의 방정식은 (x - a)<sup>2</sup> + (y - b)<sup>2</sup> = r<sup>2</sup> 입니다.)`,
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                arrow.style.left = (35 + (radius - 1) * rect.width) + 'px';
                arrow.style.top = (55 + (radius - 1) * rect.height) + 'px';
                arrow.classList.add('active');
                requestAnimationFrame(dilDraw);

                setTimeout(() => {
                    this.next();
                }, 1000);
            }
        },

        'dilationDescript_4': {
            text: '생성된 이 원은 마스크로써 활용되며 각 픽셀마다<br> 바이너리화에 의해 1이 된 부분에서만 체크 하게 됩니다.',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                arrow.classList.remove('active');

                clearInterval(intervalHandler)
                intervalHandler = null;

                dilationExecute()
            }
        },

        'dilationDescript_5_check': {
            text: '현재 픽셀은 바이너리화에 의해 1이 되어 있지만 상,하,좌,우(반투명 검은색 부분)에 바이너리 1이 모두 둘러 쌓여있기 때문에 가장 끝 부분이 아닙니다!',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                this.next();
            }
        },

        'dilationDescript_5_cardinal': {
            text: '가장 끝 부분을 확인하는 방법은 현재 픽셀 점의 <span style="color: red;">상하좌우에 <br>유효한 점(값이 1)이 모두 존재하는지로 확인 할 수 있습니다. </span> <br>사방이 모두 막혀있다는 것은 곧 경계선이 아니라는 <br>의미입니다.',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                this.next('dilationDescript_5_cardinal_2');
            }
        },

        'dilationDescript_5_cardinal_2': {
            text: '그림을 보면 원의 중앙 점 상하좌우로 검은색으로 점멸 <br>표시 된 부분이 있습니다. <br><br> 초록색이 아닌 부분이 비어 있는 부분 입니다. ',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                this.next('dilationDescript_5_cardinal_3');
            }
        },

        'dilationDescript_5_cardinal_3': {
            text: '현재 픽셀은 바이너리화에 의해 1이며, <span style="color: red;">중심점을 기점으로<br> 상,하,좌,우(반투명 검은색 부분) 중 바이너리 값 1(연두색)<br> 없는 부분이 존재하기 때문에 가장 끝 부분이므로</span> <br>마스크의 원을 검게 그려줍니다.',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                view_canvas.classList.remove('active');

                setTimeout(() => {
                    this.next();
                }, 1500);
            }
        },

        'dilationDescript_6': {
            text: '이를 반복하여 그려주게 되면 가장 끝 부분을 기준으로 <br>반지름 만큼의 칼선이 그려지게 됩니다. <br>끝까지 마져 그려보겠습니다.',
            initCbk: () => {
                popup.classList.add('active');
                view_canvas.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
                dilationExecute()

                setTimeout(() => {
                    this.next();
                }, 8000);
            }
        },

        'dilation_skip': {
            text: '다 그리는데 시간이 꽤나 오래 걸리므로 <br> 스킵을 해주도록 하겠습니다.',
            initCbk: () => {
                popup.classList.add('active');
                dil.stop();
            },
            btnCbk: () => {
                popup.classList.remove('active');
                view_canvas.classList.remove('active');
                dil.skip();
                this.next();
            }
        },

        'end': {
            text: '이렇게 하여 칼선이 만들어지게 됩니다. <br> 봐주셔서 감사합니다! <br><br>',
            initCbk: () => {
                popup.classList.add('active');
            },
            btnCbk: () => {
                popup.classList.remove('active');
            }
        },

        'blank': {
            text: '',
            initCbk: () => {
            },
            btnCbk: () => {
            }
        },
    };
}

const scenario = new scenarioObject();