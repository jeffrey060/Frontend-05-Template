
import { createElement } from './carousel/framework';
import Carousel from './carousel/carousel';
import {Timeline, Animation} from './carousel/animation';

const tl = new Timeline();
tl.add(new Animation({}, 'a', 0, 100, 1000, null))
tl.start()

const IMAGES = [
  'https://static001.geekbang.org/resource/image/57/37/57f5bd423b2afb7602b8a22d0559b737.jpg',
  'https://static001.geekbang.org/resource/image/95/d1/95775d0927a580170673aedfc70e33d1.jpg',
  'https://static001.geekbang.org/resource/image/a6/f1/a691e6b628ceb9d7c2ca9780126301f1.jpg',
  'https://static001.geekbang.org/resource/image/b1/d6/b1b70d207fed37fd54c127f9667d1fd6.jpg'
];

let carouselData = [
  {
      img: images[0],
      url:"https://time.geekbang.org/",
      title:"1号猫"
  },{
      img: images[1],
      url:"https://time.geekbang.org/",
      title:"2号猫"
  },{
      img: images[2],
      url:"https://time.geekbang.org/",
      title:"3号猫"
  },{
      img: images[3],
      url:"https://time.geekbang.org/",
      title:"4号猫"
  }
]

// const carousel = <Carousel images={IMAGES} />;
// carousel.mountTo(document.body);
let carousel = <List data={carouselData}>
    {(record) =>
        <div>
            <img src={record.img} />
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>
carousel.mountTo(document.body);
