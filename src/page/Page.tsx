import MainLayout from "../layout/MainLayout";

const Page = () => <MainLayout />;

export default Page;

// tags={[
//   {
//     tag: "user",
//     httpDatas: [
//       {
//         usecase: "userCreate",
//         method: "post",
//         path: "/user/{userId}/create",
//         tag: "user",
//         body: {
//           nama: { type: "string" },
//           alamat: {
//             type: "text",
//             textAreaLine: 2,
//           },
//           punyaKucing: {
//             type: "boolean",
//             default: false,
//           },
//           hobby123: {
//             type: "array",
//             items: {
//               type: "enum",
//               enum: [],
//             },
//           },
//           departement: {
//             type: "object",
//             properties: {
//               section: { type: "string" },
//               position: { type: "date" },
//             },
//           },
//           umur: { type: "number" },
//         },
//         query: {
//           page: {
//             type: "number",
//             default: 1,
//           },
//           size: {
//             type: "number",
//             default: 10,
//           },
//           ids: {
//             type: "array",
//             items: {
//               type: "string",
//             },
//           },
//         },
//         param: {
//           userId: { type: "string" },
//         },
//         header: {
//           token: { type: "string" },
//         },
//       },
//       {
//         usecase: "userChangeStatus",
//         method: "put",
//         path: "/user/changestatus",
//         tag: "user",
//         body: {
//           status: {
//             type: "enum",
//             enum: ["approved", "rejected"],
//           },
//         },
//       },
//     ],
//   },
//   {
//     tag: "product",
//     httpDatas: [
//       {
//         usecase: "productCreate",
//         method: "post",
//         path: "/product/create",
//         tag: "product",
//         body: {
//           nama: { type: "string" },
//           object123: {
//             type: "object",
//             properties: {
//               nama: { type: "string" },
//               hobi: {
//                 type: "enum",
//                 enum: ["memanah", "berenang"],
//               },
//             },
//           },
//           // objectdouble: {
//           //   type: "object",
//           //   properties: {
//           //     inner: {
//           //       type: "object",
//           //       properties: {
//           //         product: {
//           //           type: "string",
//           //         },
//           //       },
//           //     },
//           //   },
//           // },
//           array456: {
//             type: "array",
//             items: {
//               type: "object",
//               properties: {
//                 tipe: { type: "string" },
//                 categori: {
//                   type: "enum",
//                   enum: ["seller", "buyer"],
//                 },
//               },
//             },
//           },
//         },
//       },
//     ],
//   },
//   {
//     tag: "seller",
//     httpDatas: [
//       {
//         method: "get",
//         path: "/seller",
//         usecase: "sellerGetAll",
//         tag: "seller",
//         query: {
//           page: { type: "number" },
//           size: { type: "number" },
//           name: { type: "number" },
//         },
//         header: {
//           token: { type: "string" },
//         },
//         response: {
//           200: {
//             content: {
//               items: {
//                 type: "array",
//                 items: {
//                   type: "object",
//                   properties: {
//                     id: { type: "string" },
//                     name: { type: "string" },
//                     address: { type: "string" },
//                   },
//                 },
//               },
//               count: { type: "number" },
//             },
//           },
//         },
//       },
//     ],
//   },
// ]}
