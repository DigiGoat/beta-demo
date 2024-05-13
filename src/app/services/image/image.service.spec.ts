import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';


jest.mock('../../../assets/images/map.json', () => ({
  __esModule: true,
  default: {},
}));
describe('ImageService', () => {
  let service: ImageService;
  const id = 'PD1234';
  const idFile = 'TEST_FILE_ID';
  const idDescription = `An image for an animal with id ${id}`;
  const nickname = 'GOAT_NICKNAME';
  const nicknameFile = 'TEST_FILE_NICKNAME';
  const name = 'GOAT_NAME';
  const nameFile = 'TEST_FILE_NAME';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
    service['imageMap'] = {
      [id]: [{
        file: idFile,
        alt: idDescription
      }],
      [nickname]: [{
        file: nicknameFile
      }],
      [name]: [{
        file: nameFile
      }],
      empty: []
    };
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  test('const NotFound', () => {
    expect(service.NotFound).toEqual({
      alt: 'The Requested Image Does Not Exist',
      file: './assets/images/ImageNotFound.png',
    });
  });
  describe('getImage()', () => {
    it('should match an image when provided with a nickname', () => {
      const image = service.getImage(['FAKE_NAME', nickname, 'FAKE_ID']);
      expect(image.file).toEqual(`./assets/images/${nickname}/${nicknameFile}`);
      expect(image.alt).toBeUndefined();
    });
    it('should match an image when provided with an id', () => {
      const image = service.getImage(['FAKE_NAME', id, 'FAKE_NICKNAME']);
      expect(image.file).toEqual(`./assets/images/${id}/${idFile}`);
      expect(image.alt).toEqual(idDescription);
    });
    it('should match an image when provided with a name', () => {
      const image = service.getImage([name, 'FAKE_ID', 'FAKE_NICKNAME']);
      expect(image.file).toEqual(`./assets/images/${name}/${nameFile}`);
      expect(image.alt).toBeUndefined();

    });
    it('should return an empty path if the image does not exist', () => {
      const image = service.getImage(['FAKE_ID', 'FAKE_NICKNAME']);
      expect(image.file).toEqual('/');
      expect(image.alt).toEqual('The Requested Image Does Not Exist');
    });
  });
  describe('getImages()', () => {
    it('should match images when provided with a nickname', () => {
      const images = service.getImages(['FAKE_NICKNAME', nickname, 'FAKE_ID']);
      expect(images).toHaveLength(1);
      const image = images[0];
      expect(image.file).toEqual(`./assets/images/${nickname}/${nicknameFile}`);
      expect(image.alt).toBeUndefined();
    });
    it('should match images when provided with an id', () => {
      const images = service.getImages(['FAKE_ID', id, 'FAKE_NICKNAME']);
      expect(images).toHaveLength(1);
      const image = images[0];
      expect(image.file).toEqual(`./assets/images/${id}/${idFile}`);
      expect(image.alt).toEqual(idDescription);
    });
    it('should match images when provided with a name', () => {
      const images = service.getImages([name, 'FAKE_ID', 'FAKE_NICKNAME']);
      expect(images).toHaveLength(1);
      const image = images[0];
      expect(image.file).toEqual(`./assets/images/${name}/${nameFile}`);
      expect(image.alt).toBeUndefined();
    });
    it('should return notFound if the image is not found', () => {
      const images = service.getImages(['FAKE_ID', 'FAKE_NICKNAME', 'empty']);
      expect(images).toHaveLength(1);
      const image = images[0];
      expect(image.file).toEqual('/');
      expect(image.alt).toEqual('The Requested Image Does Not Exist');

    });
    it('should return an empty path if the image does not exist', () => {
      const images = service.getImages(['FAKE_ID', 'FAKE_NICKNAME']);
      expect(images).toHaveLength(1);
      const image = images[0];
      expect(image.file).toEqual('/');
      expect(image.alt).toEqual('The Requested Image Does Not Exist');
    });
  });
});
