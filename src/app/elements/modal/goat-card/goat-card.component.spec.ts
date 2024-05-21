import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Meta } from '@angular/platform-browser';
import { GoatCardComponent } from './goat-card.component';

describe('GoatCardComponent', () => {
  let component: GoatCardComponent;
  let fixture: ComponentFixture<GoatCardComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoatCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GoatCardComponent);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    component['meta'] = { addTag: jest.fn() } as unknown as Meta;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('With an Empty Goat', () => {
    beforeEach(() => {
      component.goat = {};
      fixture.detectChanges();
    });
    it('should not set a page description', () => {
      expect(component['meta'].addTag).toHaveBeenCalledTimes(0);
    });
    it('should not display a name', () => {
      const element = html.querySelector('[test-id=name]');
      expect(element).toBeFalsy();
    });
    it('should not display a nickname', () => {
      const element = html.querySelector('[test-id=nickname]');
      expect(element).toBeFalsy();
    });
    it('should display carousel', () => {
      const element = html.querySelectorAll('[test-id=carousel]');
      expect(element).toHaveLength(1);
    });
    it('should not display a date of birth', () => {
      const element = html.querySelector('[test-id=born]');
      expect(element).toBeFalsy();
    });
    it('should not display an id', () => {
      const element = html.querySelector('[test-id=id]');
      expect(element).toBeFalsy();
    });
    it('should not display tattoos', () => {
      const element = html.querySelector('[test-id=tattoo]');
      expect(element).toBeFalsy();
    });
    it('should not display markings', () => {
      const element = html.querySelector('[test-id=markings]');
      expect(element).toBeFalsy();
    });
    it('should not display a description', () => {
      const element = html.querySelector('[test-id=description]');
      expect(element).toBeFalsy();
    });
    it('should match the snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
  });
  describe('With a Goat', () => {
    beforeEach(() => {
      component.goat = {
        name: 'TEST_NAME',
        nickname: 'TEST_NICKNAME',
        description: 'TEST_DESCRIPTION',
        normalizeId: 'TEST_ID',
        dateOfBirth: '5/8/2024',
        animalTattoo: [{
          tattoo: 'TEST_TATTOO_1',
          tattooLocation: {
            name: 'TEST_LOCATION_1'
          }
        }, {
          tattoo: 'TEST_TATTOO_2',
          tattooLocation: {
            name: 'TEST_LOCATION_2'
          }
        }],
        colorAndMarking: 'TEST_COLOR_AND_MARKING'
      };
      fixture.detectChanges();
    });
    it('should set a page description', () => {
      expect(component['meta'].addTag).toHaveBeenCalledTimes(1);
      expect(component['meta'].addTag).toHaveBeenCalledWith({ content: 'TEST_DESCRIPTION', name: 'description', property: 'og:description' });
    });
    it('should display a name', () => {
      const element = html.querySelector('[test-id=name]');
      expect(element).toBeTruthy();
      expect(element?.innerHTML).toBe('TEST_NAME');
    });
    it('should display a nickname', () => {
      const element = html.querySelector('[test-id=nickname]');
      expect(element).toBeTruthy();
      expect(element?.innerHTML).toBe('"TEST_NICKNAME"');
    });
    it('should display carousel', () => {
      const element = html.querySelectorAll('[test-id=carousel]');
      expect(element).toHaveLength(1);
    });
    it('should display a date of birth', () => {
      const element = html.querySelector('[test-id=born]');
      expect(element).toBeTruthy();
      expect(element?.innerHTML).toBe('May 8, 2024');
    });
    it('should display an id', () => {
      const element = html.querySelector('[test-id=id]');
      expect(element).toBeTruthy();
      expect(element?.innerHTML).toBe('TEST_ID');
    });
    it('should display tattoos', () => {
      const element = html.querySelectorAll('[test-id=tattoo]');
      expect(element).toHaveLength(2);
      expect(element[0].innerHTML).toContain('<span> TEST_LOCATION_1:<span class="fw-lighter">TEST_TATTOO_1</span></span>');
      expect(element[1].innerHTML).toContain('<span> TEST_LOCATION_2:<span class="fw-lighter">TEST_TATTOO_2</span></span>');
    });
    it('should display markings', () => {
      const element = html.querySelector('[test-id=markings]');
      expect(element).toBeTruthy();
      expect(element?.innerHTML).toBe('test_color_and_marking');
    });
    it('should display a description', () => {
      const element = html.querySelector('[test-id=description]');
      expect(element).toBeTruthy();
      expect(element?.innerHTML).toBe('TEST_DESCRIPTION');
    });
    it('should match the snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
  });
});
