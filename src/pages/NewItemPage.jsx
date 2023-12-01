import ItemEditor from "../components/ItemEditor";
import useItemsStore from "../utilities/stores";
import { Navigate } from "react-router-dom";

const NewItemPage = () => {
  const user = useItemsStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex justify-center items-center mt-14 md:mt-20">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <ItemEditor />
          </div>
          <div className="md:w-1/3">
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <p className="text-gray-800 text-lg">
                Welcome to the New Food Item Page! Here you can conveniently add
                details about food items.
                <br /><br />
                Specify the food item's name, category, weight, and other relevant
                details. Set the date when the food was prepped and recovered to
                keep track of freshness. The temperature upon arrival can also be
                noted for quality control.
                <br /><br />
                Once
                you've filled in all the information, just hit 'Submit' to add the
                item to the inventory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewItemPage;
