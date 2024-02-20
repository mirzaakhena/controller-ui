import { useEffect, useState } from "react";
import { HTTPData } from "../model/data_http";

import { CopyOutlined } from "@ant-design/icons";
import JsonView from "@uiw/react-json-view";
import { Modal, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { ColumnType } from "antd/es/table/interface";
import CopyToClipboard from "react-copy-to-clipboard";

type Item = {
  id: string;
  [key: string]: any;
};

interface Props {
  httpData: HTTPData;
  items: Item[];
}

// interface TableParams {
//   pagination?: TablePaginationConfig;
//   filters?: Record<string, FilterValue>;
// }

const TableComponent = (props: Props) => {
  //

  const [tableHeight, setTableHeight] = useState(540);

  // const [items, setItems] = useState<Item[]>([
  //   {
  //     id: "1",
  //     name: "mirza",
  //     addresses: "Bandung",
  //   },
  // ]);

  // const [tableParams, setTableParams] = useState<TableParams>({
  //   pagination: { current: 1, pageSize: 15 },
  // });

  const columns = (): ColumnsType<Item> => {
    //

    // const recInputType = ((props.httpData.response?.[200]?.content?.["items"] as ArrayType)?.items as ObjectType)?.properties;

    const recInputType = props.httpData.response?.[200]?.content;

    const c: ColumnType<Item>[] = [
      {
        title: "ID",
        key: "id",
        dataIndex: "id",
        render: (item, allData) => {
          return (
            <>
              <CopyToClipboard
                text={item}
                onCopy={() => message.success(`copy id ${item}`)}
              >
                <CopyOutlined />
              </CopyToClipboard>
              {" - "}
              <a
                onClick={() =>
                  Modal.info({
                    title: "Item Detail",
                    closable: true,
                    maskClosable: true,
                    width: "60%",
                    content: (
                      <JsonView
                        collapsed={3}
                        displayDataTypes={false}
                        value={allData as Item}
                      />
                    ),
                  })
                }
              >
                {item}
              </a>
            </>
          );
        },
      },
    ];

    for (const key in recInputType) {
      //
      if (key === "id") {
        continue;
      }

      if (recInputType[key].type === "object" || recInputType[key].type === "array") {
        continue;
      }

      //
      c.push({ title: key, dataIndex: key, key: key });
    }

    return c;
  };

  // const handleTableChange = (pagination: TablePaginationConfig) => {
  //
  // setTableParams({ pagination });
  // `dataSource` is useless since `pageSize` changed
  // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
  //   setItems([]);
  // }
  // };

  useEffect(() => {
    // Update table height when the window is resized
    const handleResize = () => {
      setTableHeight(window.innerHeight);
    };

    // Set initial height
    setTableHeight(window.innerHeight);

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Item[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
  };

  return (
    <Table
      style={{ margin: "0px 20px 20px 20px" }}
      size="small"
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      rowKey={(x) => x.id}
      columns={columns()}
      dataSource={props.items}
      // pagination={tableParams.pagination}
      pagination={false}
      // onChange={handleTableChange}
      scroll={{ y: tableHeight - 150, x: 50 }}
    />
  );
};

export default TableComponent;
