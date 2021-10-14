import { StarOutlined } from '@ant-design/icons';
import { notify, useConnection } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createTokenATransaction, createTokenBTransaction, getAmountOut, getUserTokenABalance, getUserTokenBBalance, initTokenAccounts, initTokenSwap, isUserTokenAAccount, isUserTokenBAccount, setAmountIn, setIsReverse, swap, updateUserTokenAccounts } from '../../actions/swap.actions';
import { InputAmount } from '../../components/InputAmount/InputAmount';
import { SwapSymbolTypes } from '../../models/Swap.model';

const IconsMap = {
  usdt: <img src="/symbols/usdc.png" />,
  lstar: <StarOutlined />,
};

export function Swap() {
  const connection = useConnection();
  const wallet = useWallet();

  const [ fromAmount, setFromAmount ] = useState(0);
  const [ toAmount, setToAmount ] = useState(0);
  const [ isReserseState, setIsReverseState ] = useState(false);
  const [ isInited, setIsInited ] = useState(false);
  const [ isTokenCreated, setIsTokenCreated ] = useState(false);
  // lstar
  const [ balanceA, setBalanceA ] = useState(0);
  // usdc
  const [ balanceB, setBalanceB ] = useState(0);

  const currentBalance = useMemo(() => !isReserseState ? balanceA : balanceB, [isReserseState, balanceA, balanceB]);

  console.log('--cur', currentBalance, fromAmount)

  const handleCreateToken = useCallback(async () => {
    if (!isUserTokenAAccount()) {
      await createTokenATransaction();
    }
    if (!isUserTokenBAccount()) {
      await createTokenBTransaction();
    }
    setIsTokenCreated(true);

    notify({
      message: 'Token account created.',
      type: 'success',
    });
  }, []);

  const updateBalances = useCallback(async () => {
    await updateUserTokenAccounts();
    setBalanceA(getUserTokenABalance());
    setBalanceB(getUserTokenBBalance());
  }, []);

  const handleSwap = useCallback(async () => {
    if (!isTokenCreated) {
      return handleCreateToken();
    }

    try {
      const result = await swap();
      await updateBalances();
      if (result) {
        notify({
          message: 'Swap completed.',
          type: 'success',
        });
      }
    } catch(e) {
      console.error(e);
      notify({
        description:
          'Please try again and approve transactions from your wallet',
        message: 'Swap trade cancelled.',
        type: 'error',
      });
    }
  }, [isTokenCreated, handleCreateToken, updateBalances]);

  const handleFromChange = useCallback((value) => {
    setAmountIn(value);
    setFromAmount(value);
    setToAmount(getAmountOut());
  }, []);

  const handleReverse = useCallback(() => {
    setIsReverse();
    setIsReverseState((prev) => !prev);
    handleFromChange(toAmount);
  }, [ toAmount, handleFromChange ]);

  useEffect(() => {
    if (!connection || !wallet.publicKey) {
      return;
    }

    const init = async () => {
      await initTokenSwap(connection, wallet);
      await initTokenAccounts();
      await updateBalances();
      setIsInited(true);
      if (isUserTokenAAccount() && isUserTokenBAccount()) {
        setIsTokenCreated(true);
      }
    };

    init();
  }, [ connection, wallet, updateBalances ]);

  return (
    <div className="swap-root">
      <InputAmount
        value={fromAmount}
        onChange={handleFromChange}
        balance={!isReserseState ? balanceA : balanceB}
        symbol={!isReserseState ? SwapSymbolTypes.Lstar : SwapSymbolTypes.USDC}
        icon={!isReserseState ? IconsMap.lstar : IconsMap.usdt}
        label="From"
      />

      <div className="swap-swapBox">
        <Button
          type="primary"
          className="swap-swapButton"
          onClick={handleReverse}
        >
          ⇅
        </Button>
      </div>

      <InputAmount
        value={toAmount}
        balance={isReserseState ? balanceA : balanceB}
        symbol={isReserseState ? SwapSymbolTypes.Lstar : SwapSymbolTypes.USDC}
        icon={isReserseState ? IconsMap.lstar : IconsMap.usdt}
        label="To (Estimate)"
        disabled
      />

      <Button
        className="swap-submitButton"
        type="primary"
        size="large"
        onClick={wallet.connected ? handleSwap : wallet.connect}
        disabled={isTokenCreated && (!isInited || !wallet.connected || fromAmount > currentBalance || Number(fromAmount) === 0)}
      >
        {isTokenCreated ? 'Swap tokens' : 'Create token account'}
      </Button>
    </div>
  );
}
