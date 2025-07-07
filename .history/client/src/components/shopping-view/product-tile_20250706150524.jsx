import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  const { _id, image, title, category, brand, price, salePrice, totalStock } = product;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock < 10 && !isOutOfStock;
  const isOnSale = salePrice > 0;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(_id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {isOutOfStock ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Out Of Stock</Badge>
          ) : isLowStock ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{`Only ${totalStock} left`}</Badge>
          ) : isOnSale ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
          ) : null}
        </div>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-bold line-clamp-1">{title}</h2>
          <div className="flex justify-between text-muted-foreground text-[16px]">
            <span>{categoryOptionsMap[category]}</span>
            <span>{brandOptionsMap[brand]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-lg font-semibold ${isOnSale ? "line-through text-gray-500" : "text-primary"}`}>
              ${price}
            </span>
            {isOnSale && <span className="text-lg font-semibold text-primary">${salePrice}</span>}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button
          onClick={isOutOfStock ? undefined : () => handleAddtoCart(_id, totalStock)}
          className="w-full"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out Of Stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;