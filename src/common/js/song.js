export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

// 工厂方法
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg`,
    url: `http://dl.stream.qqmusic.qq.com/http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=4572658822&vkey=EB78E0AB21E53044B1DADF2202355263C701DDA02FC55083F4A669107F1EFDAA7B07FC53822C38A69D9425849D5B19A274777131A4684D66&uin=0&fromtag=38`
    // http://dl.stream.qqmusic.qq.com/http://dl.stream.qqmusic.qq.com/C400003uHn5X28tbno.m4a?guid=4572658822&vkey=EB78E0AB21E53044B1DADF2202355263C701DDA02FC55083F4A669107F1EFDAA7B07FC53822C38A69D9425849D5B19A274777131A4684D66&uin=0&fromtag=38
    // http://dl.stream.qqmusic.qq.com/http://dl.stream.qqmusic.qq.com/C4000037OKVx2ybIUT.m4a?guid=4572658822&vkey=2126A71A7EF8434B52444533DAD0C42636D500C65E0BC8F813B178C64353F961AC72BA3A719C5D3D5C8E3B3EDB030471B6EF100E735D33DF&uin=0&fromtag=38
  })
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name);
  })
  return ret.join('/');
}