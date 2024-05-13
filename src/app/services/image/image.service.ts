import { Injectable } from '@angular/core';

import imageMap from '../../../assets/images/map.json';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageMap: ImageMap = imageMap;

  constructor() { }
  getImage(searchQueries: (string | undefined)[]) {
    const key = Object.keys(this.imageMap).find(directory => searchQueries.includes(directory));
    if (key && this.imageMap[key].length) {
      const image = this.imageMap[key][0];
      return { ...image, file: `./assets/images/${key}/${image.file}` };
    }
    //Intentionally give an invalid link
    return { ...this.NotFound, file: '/' };
  }
  getImages(searchQueries: (string | undefined)[]) {
    const key = Object.keys(this.imageMap).find(directory => searchQueries.includes(directory));
    if (key && this.imageMap[key].length) {
      const images = this.imageMap[key].map(image => { return { ...image, file: `./assets/images/${key}/${image.file}` }; });
      return images;
    }
    //Intentionally give an invalid link
    return [{ ...this.NotFound, file: '/' }];
  }

  public readonly NotFound: ImageEntry = { file: './assets/images/ImageNotFound.png', alt: 'The Requested Image Does Not Exist' };
}
type ImageMap = {
  [directory: string]: ImageEntry[];
};
export type ImageEntry = {
  file: string,
  alt?: string;
};
