import {MouseEvent} from 'react';
import {
  handleMouseUpByBlurring,
  focusNextFocusableNode,
  nextFocusableNode,
} from '../focus';

describe('handleMouseUpByBlurring()', () => {
  it('calls blur on the currentTarget', () => {
    const currentTarget = document.createElement('button');
    jest.spyOn(currentTarget, 'blur');
    const mouseEvent = {currentTarget};
    handleMouseUpByBlurring(mouseEvent as MouseEvent<HTMLButtonElement>);
    expect(currentTarget.blur).toHaveBeenCalled();
  });
});

describe('nextFocusableNode', () => {
  it('does not return the initial element as the focusable node', () => {
    const {activator, otherNode} = domSetup();

    expect(nextFocusableNode(activator)).toBe(otherNode);
  });

  it('returns null when a focusable element is not found', () => {
    const {activator} = domSetup({
      otherNodeTag: 'div',
    });

    expect(nextFocusableNode(activator)).toBeNull();
  });

  it("returns the parent of an adjacent element when it's focusable", () => {
    const {activator, otherNode} = domSetup();

    expect(nextFocusableNode(activator)).toBe(otherNode);
  });

  it('searches adjacent elements for focusable children', () => {
    const {activator, otherNodeNested} = domSetup({
      otherNodeTag: 'div',
      nested: true,
    });

    expect(nextFocusableNode(activator)).toBe(otherNodeNested);
  });
});

describe('focusNextFocusableNode', () => {
  it('returns true when the node was focused', () => {
    const {activator} = domSetup();

    expect(focusNextFocusableNode(activator)).toBe(true);
  });

  it('returns false when the node was not focused', () => {
    const {activator} = domSetup({otherNodeTag: 'div'});

    expect(focusNextFocusableNode(activator)).toBe(false);
  });

  it('focused the node', () => {
    const {activator, otherNode} = domSetup();

    focusNextFocusableNode(activator);

    expect(document.activeElement).toBe(otherNode);
  });
});

function domSetup(
  options: {
    wrapperTag?: string;
    activatorTag?: string;
    otherNodeTag?: string;
    otherNodeNestedTag?: string;
    nested?: boolean;
  } = {},
) {
  const {
    wrapperTag = 'div',
    activatorTag = 'button',
    otherNodeTag = 'button',
    otherNodeNestedTag = 'button',
    nested,
  } = options;
  const wrapper = document.createElement(wrapperTag);
  const activator = document.createElement(activatorTag);
  const otherNode = document.createElement(otherNodeTag);
  let otherNodeNested = null;

  if (nested) {
    otherNodeNested = document.createElement(otherNodeNestedTag);
    otherNode.appendChild(otherNodeNested);
  }

  wrapper.append(activator, otherNode);

  return {wrapper, activator, otherNode, otherNodeNested};
}
