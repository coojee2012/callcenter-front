import React from 'react';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

const treeNode = (item, index) => {
  /** @namespace item.resourceName */
  /** @namespace item.childResourceList */
  return (
    <TreeNode value={item.resourceId} title={item.resourceName} key={index}>
      {item.childResourceList.map((node) => {
        return (
          <TreeNode value={node.resourceId} title={node.resourceName} key={node.resourceId}/>
        );
      })}
    </TreeNode>
  );
};

export function createTreeSelect(treeProps, data) {
  return (
    <TreeSelect {...treeProps}>
      {data.map((item, index) => (treeNode(item, index)))}
    </TreeSelect>
  );
}
