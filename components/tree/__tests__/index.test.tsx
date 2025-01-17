import React from 'react';
import { render } from '../../../tests/utils';
import Tree from '../index';
import type { AntTreeNodeProps } from '../Tree';

const { TreeNode } = Tree;

describe('Tree', () => {
  it('icon and switcherIcon of Tree with showLine should render correctly', () => {
    const { asFragment } = render(
      <Tree showLine showIcon>
        <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-0">
          <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-0-0" />
          <TreeNode switcherIcon="switcherIcon" key="0-0-1" />
          <TreeNode icon="icon" key="0-0-2" />
          <TreeNode key="0-0-3" />
        </TreeNode>
        <TreeNode switcherIcon="switcherIcon" key="0-1">
          <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-0-0" />
          <TreeNode switcherIcon="switcherIcon" key="0-0-1" />
          <TreeNode icon="icon" key="0-0-2" />
          <TreeNode key="0-0-3" />
        </TreeNode>
        <TreeNode key="0-2">
          <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-0-0" />
          <TreeNode switcherIcon="switcherIcon" key="0-0-1" />
          <TreeNode icon="icon" key="0-0-2" />
          <TreeNode key="0-0-3" />
        </TreeNode>
      </Tree>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('switcherIcon in Tree should not render at leaf nodes', () => {
    const { container } = render(
      <Tree switcherIcon={<i className="switcherIcon" />} defaultExpandAll>
        <TreeNode icon="icon">
          <TreeNode id="node1" title="node1" icon="icon" key="0-0-2" />
          <TreeNode id="node2" title="node2" key="0-0-3" />
        </TreeNode>
      </Tree>,
    );
    expect(container.querySelectorAll('.switcherIcon').length).toBe(1);
  });

  it('switcherIcon in Tree could be string', () => {
    const { asFragment } = render(
      <Tree switcherIcon="switcherIcon" defaultExpandAll>
        <TreeNode icon="icon">
          <TreeNode id="node1" title="node1" icon="icon" key="0-0-2" />
          <TreeNode id="node2" title="node2" key="0-0-3" />
        </TreeNode>
      </Tree>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('switcherIcon should be loading icon when loadData', () => {
    const onLoadData = () =>
      new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    const { asFragment } = render(
      <Tree switcherIcon="switcherIcon" defaultExpandAll loadData={onLoadData}>
        <TreeNode icon="icon">
          <TreeNode id="node1" title="node1" icon="icon" key="0-0-2" />
          <TreeNode id="node2" title="node2" key="0-0-3" />
        </TreeNode>
      </Tree>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('switcherIcon in Tree could be render prop function', () => {
    const { container } = render(
      <Tree
        defaultExpandAll
        switcherIcon={({ expanded }: AntTreeNodeProps) =>
          expanded ? <span className="open" /> : <span className="close" />
        }
      >
        <TreeNode icon="icon">
          <TreeNode id="node1" title="node1" icon="icon" key="0-0-2" />
          <TreeNode id="node2" title="node2" key="0-0-3" />
        </TreeNode>
      </Tree>,
    );
    expect(container.querySelectorAll('.open').length).toBe(1);
  });

  // https://github.com/ant-design/ant-design/issues/23261
  it('showLine is object type should render correctly', () => {
    const { asFragment } = render(
      <Tree showLine={{ showLeafIcon: false }} defaultExpandedKeys={['0-0-0']}>
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-0" key="0-0-0">
            <TreeNode title="leaf" key="0-0-0-0" />
            <TreeNode title="leaf" key="0-0-0-1" />
            <TreeNode title="leaf" key="0-0-0-2" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title="leaf" key="0-0-1-0" />
          </TreeNode>
          <TreeNode title="parent 1-2" key="0-0-2">
            <TreeNode title="leaf" key="0-0-2-0" />
            <TreeNode title="leaf" key="0-0-2-1" />
          </TreeNode>
        </TreeNode>
      </Tree>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  describe('draggable', () => {
    const dragTreeData = [
      {
        title: 'bamboo',
        key: 'bamboo',
      },
    ];

    it('hide icon', () => {
      const { container } = render(<Tree treeData={dragTreeData} draggable={{ icon: false }} />);
      expect(container.querySelector('.anticon-holder')).toBeFalsy();
    });

    it('customize icon', () => {
      const { container } = render(
        <Tree treeData={dragTreeData} draggable={{ icon: <span className="little" /> }} />,
      );
      expect(container.querySelector('.little')).toBeTruthy();
    });

    it('nodeDraggable', () => {
      const nodeDraggable = jest.fn(() => false);
      render(<Tree treeData={dragTreeData} draggable={{ nodeDraggable }} />);
      expect(nodeDraggable).toHaveBeenCalledWith(dragTreeData[0]);
    });

    it('nodeDraggable func', () => {
      const nodeDraggable = jest.fn(() => false);
      render(<Tree treeData={dragTreeData} draggable={nodeDraggable} />);
      expect(nodeDraggable).toHaveBeenCalledWith(dragTreeData[0]);
    });
  });
});
