import {
  AutoComplete,
  Option,
} from "@/components/shared-ui/AutoCompleteSearch";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import React, { useState } from "react";

interface AccountAutoCompleteProps {
  onChange: (accountId: string | null) => void;
  placeholder?: string;
}

const AccountAutoComplete: React.FC<AccountAutoCompleteProps> = ({
  onChange,
  placeholder = "Search by name or phone number...",
}) => {
  const { data: accounts, isLoading } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<Option | undefined>(
    undefined
  );

  const accountOptions: Option[] =
    accounts?.map((account) => ({
      value: account.id,
      label: `${account.name} (${account.phoneNumber})`,
    })) ?? [];

  const handleSelectAccount = (option: Option | undefined) => {
    setSelectedAccount(option);
    if (option && "account" in option) {
      onChange(option.value);
    } else {
      onChange(null);
    }
  };

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  return (
    <AutoComplete
      options={accountOptions}
      onValueChange={handleSelectAccount}
      emptyMessage="No accounts found"
      placeholder={placeholder}
      value={selectedAccount}
    />
  );
};

export default AccountAutoComplete;
