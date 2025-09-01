import { useState } from 'react';
import {
  Button,
  SpaceBetween,
  StatusIndicator,
  Popover,
  Box,
  Modal,
} from '@cloudscape-design/components';
import { SummaryTable } from '@nextcart/ui-commons';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Product } from '@nextcart/models';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  productId: string;
  cartItemId: string;
  name: string;
  quantity: number;
  product?: Product;
  warnings?: string[];
}

interface Props {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export function CartItemsTable({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: Props) {
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const navigate = useNavigate();
  const confirmRemove = () => {
    if (itemToRemove) {
      onRemoveItem(itemToRemove.cartItemId);
      setItemToRemove(null);
    }
  };

  return (
    <>
      <SummaryTable<CartItem>
        items={items}
        trackBy="cartItemId"
        header="Products in Cart"
        columnDefinitions={[
          {
            id: 'name',
            header: 'Product',
            cell: (item) => (
              <SpaceBetween direction="horizontal" size="xs">
                <span>
                  <Button
                    variant="inline-link"
                    onClick={() =>
                      navigate(`/products/${item.product?.productId}`)
                    }
                  >
                    {item.product?.name}
                  </Button>
                </span>
                {item.warnings && item.warnings.length > 0 && (
                  <Popover
                    position="top"
                    size="small"
                    content={
                      <Box fontSize="body-s">
                        {item.warnings.map((w, idx) => (
                          <li key={idx}>
                            {w === 'NOT_COMPATIBLE_WITH_DIET'
                              ? 'Not compatible with your diets'
                              : w === 'NOT_COMPATIBLE_WITH_CONDITION'
                              ? 'Not compatible with your health conditions'
                              : 'Other incompatibility'}
                          </li>
                        ))}
                      </Box>
                    }
                  >
                    <div style={{ display: 'inline-block', cursor: 'help' }}>
                      <StatusIndicator type="warning" />
                    </div>
                  </Popover>
                )}
              </SpaceBetween>
            ),
          },
          {
            id: 'quantity',
            header: 'Quantity',
            cell: (item) => item.quantity,
          },
          {
            id: 'actions',
            header: 'Actions',
            cell: (item) => (
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => onUpdateQuantity(item.cartItemId, 1)}>
                  +
                </Button>
                <Button
                  disabled={item.quantity <= 1}
                  onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                >
                  -
                </Button>
                <Button
                  variant="inline-link"
                  onClick={() => setItemToRemove(item)}
                >
                  Remove
                </Button>
              </SpaceBetween>
            ),
          },
        ]}
        variant="embedded"
        stickyHeader
        empty={
          <Box textAlign="center" color="inherit">
            <b>This cart is empty.</b>
          </Box>
        }
      />

      {itemToRemove && (
        <Modal
          onDismiss={() => setItemToRemove(null)}
          visible={true}
          header="Confirm removal"
          footer={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setItemToRemove(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmRemove}>
                Remove
              </Button>
            </SpaceBetween>
          }
        >
          <Box>
            Are you sure you want to remove{' '}
            <strong>{itemToRemove.product?.name ?? 'this product'}</strong> from
            the cart?
          </Box>
        </Modal>
      )}
    </>
  );
}
