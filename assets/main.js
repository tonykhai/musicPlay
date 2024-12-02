var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const cdWidth = cd.offsetWidth
const heading = $('header h2')
const cdThump = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    //database bài nhạc
    songs: [
        {
            name: 'Chúng ta của hiện tại',
            singer: 'Sơn Tùng Mtp',
            path: './assets/music/ChungTaCuaHienTai-SonTungMTP-6892340.mp3',
            image: './assets/img/chung_ta_cua_hien_tai_mtp.jpg'
        },
        {
            name: 'Em Xinh',
            singer: 'Mono',
            path: './assets/music/EmXinh-MONOOnionn-12581640.mp3',
            image:'./assets/img/EmXinh-Mono.jpg'
        },
        {
            name: 'Hư Không',
            singer: 'Kha',
            path: './assets/music/HuKhong-Kha-12792565.mp3',
            image:'./assets/img/HuKhong-Kha.jpg'
        },
        {
            name: 'Get Some More',
            singer: 'Sol7',
            path: './assets/music/GetSomeMore-Sol7-7751761.mp3',
            image:'./assets/img/GetSomeMore-Sol7.jpg'
        },
        {
            name: 'Phóng Zin Zin',
            singer: 'Tlinh ft. LowG',
            path: './assets/music/PhongZinZin-tlinhLowG.mp3',
            image:'./assets/img/PhongZinZin-tlinhLowG.jpg'
        },
        {
            name: 'NOLOVENOLIFE',
            singer: 'HIEUTHUHAI',
            path: './assets/music/NOLOVENOLIFE-HIEUTHUHAI-11966374.mp3',
            image:'./assets/img/NOLOVENOLIFE-HIEUTHUHAi.jpg'
        },
        {
            name: 'Thuỷ Triều',
            singer: 'Quang Hùng MasterD',
            path: './assets/music/ThuyTrieu-QuangHung.mp3',
            image:'./assets/img/ThuyTrieu-QuangHung.jpg'
        }
    ],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    // Hiển thị data lên màn hình
    render: function(){
        var html = this.songs.map(function(song, index){
            return `
            <div class="song ${index === app.currentIndex ? 'active':''}" data-index ="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

            </div>
            `

        })

        //hiển thị danh sách các bài hát
        playList.innerHTML = html.join('')
    },
    
    //hiển thị bài hát đang phát
    loadCurentSong: function(){
        heading.textContent = this.currentSong.name
        cdThump.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    //xử lý chuyển bài
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex>=this.songs.length)
            this.currentIndex = 0
        this.loadCurentSong()
    },

    //xử lý mở lại bài trước
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex<0)
            this.currentIndex = this.songs.length - 1
        this.loadCurentSong()
    },

    //xử lý Random nhạc
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurentSong()
    },

    //xử lý auto scroll tới bài hát đang đc phát
    scrollToActiveSong: function(){
        if(this.currentIndex == 0){
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }, 300);
        }else{
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }, 300);
        }
    },

    // xử lý sự kiện
    handleEvent: function(){
        //xứ lý thu nhỏ cd khi cuộn playlist
        document.onscroll = function(){
            const scrollTop = window.scrollY
            const newcdWidth = cdWidth - scrollTop
            cd.style.width = newcdWidth >0? newcdWidth + 'px' :0
            cd.style.opacity = newcdWidth / cdWidth
        }

        //xử lý hoạt ảnh cd quay
        const cdAnimation = cdThump.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause()

        //click nút play
        playBtn.onclick = function(){
            if(app.isPlaying)
                audio.pause()
            else
                audio.play()
        }

        //click nút next song
        nextBtn.onclick = function(){
            if(app.isRandom)
                app.randomSong()
            else
                app.nextSong()
            audio.play()
            app.render()
            app.scrollToActiveSong()

        }

        //click prev song
        prevBtn.onclick = function(){
            if(app.isRandom)
                app.randomSong()
            else
                app.prevSong()
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        //khi dừng nhạc
        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdAnimation.pause()
        }

        //khi phát nhạc
        audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdAnimation.play()
        }

        //tiến độ nhạc
        audio.ontimeupdate = function(){
            if(audio.currentTime){
                var progressPercent = Math.floor(audio.currentTime/ audio.duration * 100)
                progress.value = progressPercent 
            }
        }

        //next/repeat lại nhạc khi end
        audio.onended = function(){
            if(app.isRepeat)
                audio.play()
            else
                nextBtn.click()
        }

        //khi tua nhạc
        progress.onchange = function(e){
            var timeChange = e.target.value * audio.duration /100
            audio.currentTime = timeChange
        }

        //click on/off Random song
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active',app.isRandom)
        }

        //click on/off playBack Song
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active',app.isRepeat)
        }

        //click bài hát bất kỳ và play
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurentSong()
                    app.render()
                    audio.play()
                }
            
        }
    },

    //hàm khởi chạy ứng dụng
    start: function(){
        this.defineProperties()
        this.render()
        this.loadCurentSong()
        this.handleEvent()
    }
}
app.start()