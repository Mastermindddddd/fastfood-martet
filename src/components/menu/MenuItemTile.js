import Image from 'next/image'
import AddToCartButton from "@/components/menu/AddToCartButton";

export default function MenuItemTile({onAddToCart, ...item}) {
  const {image, description, name, basePrice,
    sizes, extraIngredientPrices,
  } = item;
  const hasSizesOrExtras = sizes?.length > 0 || extraIngredientPrices?.length > 0;
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center
      group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="relative mx-auto h-24 w-full max-w-[200px]">
        {image ? (
          <Image
            src={image}
            alt={name || 'Menu item'}
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-600">
            No image
          </div>
        )}
      </div>
      <h4 className="font-semibold text-xl my-3">{name}</h4>
      <p className="text-gray-500 text-sm line-clamp-3">
        {description}
      </p>
      <AddToCartButton
        image={image}
        hasSizesOrExtras={hasSizesOrExtras}
        onClick={onAddToCart}
        basePrice={basePrice}
      />
    </div>
  );
}