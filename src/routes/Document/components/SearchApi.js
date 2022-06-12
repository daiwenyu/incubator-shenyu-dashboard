import { Tree, Input } from "antd";
import React, { useEffect, useState } from "react";
import { getDocMenus } from "../../../services/api";

const { TreeNode } = Tree;
const { Search } = Input;

function SearchApi(props) {
  const { onSelect } = props;
  const [menuData, setMenuData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const initData = async () => {
    const { code, data = {} } = await getDocMenus();
    if (code === 200) {
      const { menuProjects = [] } = data;
      const treeKeys = [];
      const createKey = (treeData, keys) => {
        treeData.forEach((item, index) => {
          const { children, id } = item;
          const key = [...keys, index].join("-");
          item.key = id || key;
          treeKeys.push(key);
          if (children?.length) {
            createKey(children, [...keys, index]);
          }
        });
      };
      createKey(menuProjects, []);
      setMenuData(menuProjects);
      setExpandedKeys(treeKeys);
    }
  };

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

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      <Search onChange={handleSearchChange} />
      <Tree
        autoExpandParent={autoExpandParent}
        expandedKeys={expandedKeys}
        onExpand={handleExpandChange}
        onSelect={onSelect}
      >
        {renderTreeNode(menuData)}
      </Tree>
    </>
  );
}

export default SearchApi;
