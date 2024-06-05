import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { server } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import Loader from "../../components/loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Products = () => {

  const { user } = useSelector((state : {userReducer : UserReducerInitialState}) => state.userReducer)

  const { isLoading, isError, error, data} = useAllProductsQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);
  const err = error as CustomError;

  if(isError) toast.error(err.data.message);


  useEffect(() => {
    if(data){
      setRows(data.products.map((i) => ({
        photo: <img src={`${server}/${i.photo}`} />,               //we dont use direct i.photo because above we declare photo as react element
        name : i.name,
        price : i.price,
        stock : i.stock,
        action : <Link to = {`/admin/product/${i._id}`}> Manage </Link>
      })));
    }
  }, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Loader/> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
