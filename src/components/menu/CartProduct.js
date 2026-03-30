import Trash from "@/components/icons/Trash";
import Image from "next/image";

export default function CartProduct({ product, onRemove, index }) {
  const itemTotal = ((product?.price || 0) * (product?.quantity || 1)).toFixed(2);

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        {product?.image ? (
          <Image width={240} height={240} src={product.image} alt={product?.name || "Product"} />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="grow">
        <h3 className="font-semibold">{product?.name}</h3>

        {product?.size && (
          <div className="text-sm">
            Size: <span>{product.size.name}</span>
          </div>
        )}

        {product?.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map((extra, i) => (
              <div key={extra._id || extra.name || i}>
                {extra.name} {extra.price ? `R${extra.price}` : ""}
              </div>
            ))}
          </div>
        )}

        {product?.quantity ? (
          <div className="text-sm text-gray-500">
            Quantity: {product.quantity}
          </div>
        ) : null}
      </div>

      <div className="text-lg font-semibold">
        R{itemTotal}
      </div>

      {!!onRemove && (
        <div className="ml-2">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2"
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
}