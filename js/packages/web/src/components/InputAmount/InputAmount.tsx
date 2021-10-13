import { NumericInput } from '@oyster/common';
import { Typography } from 'antd';
import React from 'react';

export function InputAmount({ value, label, balance, symbol, icon, disabled = false, onChange }: {
  value: number;
  balance: number;
  label: string;
  symbol: string;
  disabled?: boolean;
  icon: any;
  onChange?: (value: number) => void;
}) {

  return (
    <div className="inputAmount-root">
      <div className="inputAmount-labelBox">
        <Typography.Text>{label}</Typography.Text>
        <Typography.Text>Balance: {balance}</Typography.Text>
      </div>
      <div className="inputAmount-wrapperBox">
        <div className="inputAmount-inputBox">
          <NumericInput
            value={value}
            onChange={onChange}
            placeholder="0.00"
            disabled={disabled}
          />
        </div>
        <div className="inputAmount-symbolBox">
          <div className="inputAmount-icon">{icon}</div>
          <div className="inputAmount-symbol">{symbol}</div>
        </div>
      </div>
    </div>
  )
}
