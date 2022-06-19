import { Tree, Input } from "antd";
import React, { useContext, useEffect, useState } from "react";
import ApiContext from "./ApiContext";

const { TreeNode } = Tree;
const { Search } = Input;

function SearchApi(props) {
  const { onSelect } = props;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const {
    apiData: { menuProjects }
  } = useContext(ApiContext);

  const renderTreeNode = data => {
    return data.map(item => {
      const { children, id, label, key } = item;
      const index = label.indexOf(searchValue);
      const beforeStr = label.substr(0, index);
      const afterStr = label.substr(index + searchValue.length);
      const titleObj =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: "#f50" }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{label}</span>
        );
      return (
        <TreeNode key={key} title={titleObj} selectable={id !== undefined}>
          {children?.length && renderTreeNode(children)}
        </TreeNode>
      );
    });
  };

  const handleSearchChange = e => {
    const { value } = e.target;
    // const expandedKeys = menuData
    //   .map(item => {
    //     if (item.label.indexOf(value) > -1) {
    //       return getParentKey(item.key, gData);
    //     }
    //     return null;
    //   })
    //   .filter((item, i, self) => item && self.indexOf(item) === i);

    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const handleExpandChange = keys => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  useEffect(
    () => {
      // FIXME 设置展开key
      // console.log(menuProjects);
    },
    [menuProjects]
  );

  return (
    <div style={{ overflow: "auto" }}>
      <Search onChange={handleSearchChange} />
      {menuProjects && (
        <Tree
          defaultExpandAll
          autoExpandParent={autoExpandParent}
          expandedKeys={expandedKeys}
          onExpand={handleExpandChange}
          onSelect={onSelect}
        >
          {renderTreeNode(menuProjects)}
        </Tree>
      )}
    </div>
  );
}

export default SearchApi;
