/* global document */
import {_deepEqual as deepEqual} from '@deck.gl/core';
import type {Deck, Widget, WidgetPlacement} from '@deck.gl/core';
import {h, render} from 'preact';
import {IconButton} from './components';

interface FullscreenWidgetProps {
  id: string;
  viewId?: string | null;
  placement?: WidgetPlacement;
  /**
   * A [compatible DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#Compatible_elements) which should be made full screen.
   * By default, the map container element will be made full screen.
   */
  /* eslint-enable max-len */
  container?: HTMLElement;
  label?: string;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
}

export class FullscreenWidget implements Widget<FullscreenWidgetProps> {
  id = 'fullscreen';
  props: FullscreenWidgetProps;
  placement: WidgetPlacement = 'top-left';
  viewId = null;

  deck?: Deck;
  element?: HTMLDivElement;

  fullscreen: boolean = false;

  constructor(props: FullscreenWidgetProps) {
    this.id = props.id || 'fullscreen';
    this.viewId = props.viewId || null;
    this.placement = props.placement || 'top-left';
    props.label = props.label || 'Toggle Fullscreen';
    props.style = props.style || {};
    this.props = props;
  }

  onAdd({deck}: {deck: Deck}): HTMLDivElement {
    const {style, className} = this.props;
    const el = document.createElement('div');
    el.classList.add('deckgl-widget', 'deckgl-widget-fullscreen');
    if (className) el.classList.add(className);
    Object.entries(style).map(([key, value]) => el.style.setProperty(key, value));
    this.deck = deck;
    this.element = el;
    this.update();
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    return el;
  }

  onRemove() {
    this.deck = undefined;
    this.element = undefined;
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
  }

  update() {
    const {label} = this.props;
    const el = this.element;
    const ui = (
      <IconButton onClick={this.handleClick.bind(this)} label={label} size={28}>
        {this.fullscreen ? (
          <path
            d="M9.6762 18.3238H6.95237C6.68254 18.3238 6.45635 18.2322 6.2738 18.049C6.09127 17.8658 6 17.6389 6 17.3681C6 17.0973 6.09127 16.8714 6.2738 16.6905C6.45635 16.5095 6.68254 16.4191 6.95237 16.4191H10.6286C10.8984 16.4191 11.1246 16.5103 11.3071 16.6929C11.4897 16.8754 11.5809 17.1016 11.5809 17.3714V21.0476C11.5809 21.3175 11.4894 21.5436 11.3062 21.7262C11.123 21.9087 10.896 22 10.6252 22C10.3544 22 10.1286 21.9087 9.94763 21.7262C9.76668 21.5436 9.6762 21.3175 9.6762 21.0476V18.3238ZM18.3238 18.3238V21.0476C18.3238 21.3175 18.2322 21.5436 18.049 21.7262C17.8658 21.9087 17.6389 22 17.3681 22C17.0973 22 16.8714 21.9087 16.6905 21.7262C16.5095 21.5436 16.4191 21.3175 16.4191 21.0476V17.3714C16.4191 17.1016 16.5103 16.8754 16.6929 16.6929C16.8754 16.5103 17.1016 16.4191 17.3714 16.4191H21.0476C21.3175 16.4191 21.5436 16.5106 21.7262 16.6938C21.9087 16.877 22 17.104 22 17.3748C22 17.6456 21.9087 17.8714 21.7262 18.0524C21.5436 18.2333 21.3175 18.3238 21.0476 18.3238H18.3238ZM9.6762 9.6762V6.95237C9.6762 6.68254 9.76779 6.45635 9.95097 6.2738C10.1342 6.09127 10.3611 6 10.6319 6C10.9027 6 11.1286 6.09127 11.3095 6.2738C11.4905 6.45635 11.5809 6.68254 11.5809 6.95237V10.6286C11.5809 10.8984 11.4897 11.1246 11.3071 11.3071C11.1246 11.4897 10.8984 11.5809 10.6286 11.5809H6.95237C6.68254 11.5809 6.45635 11.4894 6.2738 11.3062C6.09127 11.123 6 10.896 6 10.6252C6 10.3544 6.09127 10.1286 6.2738 9.94763C6.45635 9.76668 6.68254 9.6762 6.95237 9.6762H9.6762ZM18.3238 9.6762H21.0476C21.3175 9.6762 21.5436 9.76779 21.7262 9.95097C21.9087 10.1342 22 10.3611 22 10.6319C22 10.9027 21.9087 11.1286 21.7262 11.3095C21.5436 11.4905 21.3175 11.5809 21.0476 11.5809H17.3714C17.1016 11.5809 16.8754 11.4897 16.6929 11.3071C16.5103 11.1246 16.4191 10.8984 16.4191 10.6286V6.95237C16.4191 6.68254 16.5106 6.45635 16.6938 6.2738C16.877 6.09127 17.104 6 17.3748 6C17.6456 6 17.8714 6.09127 18.0524 6.2738C18.2333 6.45635 18.3238 6.68254 18.3238 6.95237V9.6762Z"
            fill="currentColor"
          />
        ) : (
          <path
            d="M7.90474 20.0953H10.6286C10.8984 20.0953 11.1246 20.1868 11.3071 20.37C11.4897 20.5532 11.5809 20.7802 11.5809 21.051C11.5809 21.3218 11.4897 21.5476 11.3071 21.7286C11.1246 21.9095 10.8984 22 10.6286 22H6.95237C6.68254 22 6.45635 21.9087 6.2738 21.7262C6.09127 21.5436 6 21.3175 6 21.0476V17.3714C6 17.1016 6.09159 16.8754 6.27477 16.6929C6.45795 16.5103 6.68493 16.4191 6.95571 16.4191C7.2265 16.4191 7.45236 16.5103 7.63331 16.6929C7.81427 16.8754 7.90474 17.1016 7.90474 17.3714V20.0953ZM7.90474 7.90474V10.6286C7.90474 10.8984 7.81315 11.1246 7.62997 11.3071C7.44679 11.4897 7.21981 11.5809 6.94903 11.5809C6.67825 11.5809 6.45238 11.4897 6.27143 11.3071C6.09048 11.1246 6 10.8984 6 10.6286V6.95237C6 6.68254 6.09127 6.45635 6.2738 6.2738C6.45635 6.09127 6.68254 6 6.95237 6H10.6286C10.8984 6 11.1246 6.09159 11.3071 6.27477C11.4897 6.45795 11.5809 6.68493 11.5809 6.95571C11.5809 7.2265 11.4897 7.45236 11.3071 7.63331C11.1246 7.81427 10.8984 7.90474 10.6286 7.90474H7.90474ZM20.0953 20.0953V17.3714C20.0953 17.1016 20.1868 16.8754 20.37 16.6929C20.5532 16.5103 20.7802 16.4191 21.051 16.4191C21.3218 16.4191 21.5476 16.5103 21.7286 16.6929C21.9095 16.8754 22 17.1016 22 17.3714V21.0476C22 21.3175 21.9087 21.5436 21.7262 21.7262C21.5436 21.9087 21.3175 22 21.0476 22H17.3714C17.1016 22 16.8754 21.9084 16.6929 21.7252C16.5103 21.542 16.4191 21.3151 16.4191 21.0443C16.4191 20.7735 16.5103 20.5476 16.6929 20.3667C16.8754 20.1857 17.1016 20.0953 17.3714 20.0953H20.0953ZM20.0953 7.90474H17.3714C17.1016 7.90474 16.8754 7.81315 16.6929 7.62997C16.5103 7.44679 16.4191 7.21981 16.4191 6.94903C16.4191 6.67825 16.5103 6.45238 16.6929 6.27143C16.8754 6.09048 17.1016 6 17.3714 6H21.0476C21.3175 6 21.5436 6.09127 21.7262 6.2738C21.9087 6.45635 22 6.68254 22 6.95237V10.6286C22 10.8984 21.9084 11.1246 21.7252 11.3071C21.542 11.4897 21.3151 11.5809 21.0443 11.5809C20.7735 11.5809 20.5476 11.4897 20.3667 11.3071C20.1857 11.1246 20.0953 10.8984 20.0953 10.6286V7.90474Z"
            fill="currentColor"
          />
        )}
      </IconButton>
    );
    render(ui, el);
  }

  setProps(props: FullscreenWidgetProps) {
    const oldProps = this.props;
    const el = this.element;
    if (oldProps.className !== props.className) {
      if (oldProps.className) el.classList.remove(oldProps.className);
      if (props.className) el.classList.add(props.className);
    }

    if (!deepEqual(oldProps.style, props.style, 1)) {
      Object.entries(oldProps.style).map(([key]) => el.style.removeProperty(key));
      Object.entries(props.style).map(([key, value]) => el.style.setProperty(key, value));
    }

    Object.assign(this.props, props);
  }

  getContainer() {
    // @ts-expect-error canvas is protected. Merge https://github.com/visgl/deck.gl/pull/7919?
    return this.props.container || this.deck?.canvas?.parentElement;
  }

  onFullscreenChange() {
    const prevFullscreen = this.fullscreen;
    const fullscreen = document.fullscreenElement === this.getContainer();
    if (prevFullscreen !== fullscreen) {
      this.fullscreen = !this.fullscreen;
    }
    this.update();
  }

  async handleClick() {
    if (this.fullscreen) {
      await this.exitFullscreen();
    } else {
      await this.requestFullscreen();
    }
    this.update();
  }

  async requestFullscreen() {
    const container = this.getContainer();
    if (container.requestFullscreen) {
      await container.requestFullscreen({navigationUI: 'hide'});
    } else {
      this.togglePseudoFullscreen();
    }
  }

  async exitFullscreen() {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else {
      this.togglePseudoFullscreen();
    }
  }

  togglePseudoFullscreen() {
    this.getContainer().classList.toggle('deckgl-pseudo-fullscreen');
  }
}
