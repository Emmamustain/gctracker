import Card from "@/components/Card/Card";

import useCardsStore from "@/hook/useCardsStore";

function DiscoverCards() {
  const { cards } = useCardsStore();
  return (
    <div className="mt-[45px] w-full">
      <h1 className="pl-2 text-lg font-semibold text-gray-600">
        All Giftcards
      </h1>
      <div className="mt-2 flex w-full gap-4 rounded-2xl border-1 border-gray-200 bg-gray-100 p-4">
        {cards
          .filter((card) => card.favorite === false)
          .map((card) => (
            <Card key={card.id} logo={card.image} id={card.id} />
          ))}
      </div>
    </div>
  );
}

export default DiscoverCards;
