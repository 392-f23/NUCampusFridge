import ItemEditor from "../components/ItemEditor";
import useDealsStore from "../utilities/stores";
import { Navigate } from "react-router-dom";

const NewItemPage = () => {
  const user = useDealsStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="flex justify-center items-center mt-14 md:mt-20">
        <div className="w-full max-w-6xl p-4 md:flex md:space-x-6">
          <div className="md:w-2/3">
            <ItemEditor />
          </div>
          <div className="md:w-1/3">
            <p className="text-gray-200 text-lg hidden md:block">
              Welcome to the New Food Item Page! Here you can conveniently add
              details about food items. Whether it's a dish for a small family
              dinner or a large catering event, our form makes it easy to enter
              all the necessary information.
              <br />
              <br />
              Specify the food item's name, category, weight, and other relevant
              details. Set the date when the food was prepped and recovered to
              keep track of freshness. The temperature upon arrival can also be
              noted for quality control.
              <br />
              <br />
              Don’t forget to add an attractive image of the food item. Once
              you've filled in all the information, just hit 'Submit' to add the
              item to your inventory or menu. Manage your food items efficiently
              and effectively!
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default NewItemPage;
