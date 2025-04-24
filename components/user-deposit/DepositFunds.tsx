import { motion } from "framer-motion";
import { FormProvider } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DepositModal from "@/components/modals/deposit-modal";
import TransactionHash from "@/components/user-deposit/TransactionHash";
import { UseFormReturn } from "react-hook-form";
import { useAccount } from "wagmi";
import { PaymentModal } from "./payment-modal"
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalSlice";
import { toast } from "sonner"
import { useState } from "react";
import { createDeposit } from "@/app/actions/deposit";
import { useUser } from "@clerk/nextjs";
// import { createCopyTrade } from "@/app/actions/copytrade";
// import { createStockPurchase } from "@/app/actions/stockPurchase";

interface DepositFundsProps {
  form: UseFormReturn<{ currency: string; amount: number }>;
  cryptocurrencies: Array<{ id: string; value: string; name: string }>;
  selectedAddress: string;
  handleCurrencyChange: (value: string) => void;
  onSubmit: (data: { currency: string; amount: number }) => void;
  isLoading: boolean;
  stockOption: { stock: { total: number; symbol: string; name: string; price: number; change: number; isMinus: boolean; } };
  copyTrade: { copy: { title: string; trade_min: number; trade_max: number; trade_risk: string;  trade_roi_min: number; trade_roi_max: number; } };
  baseError: { shortMessage: string };
  tranHash: string;
}

const DepositFunds: React.FC<DepositFundsProps> = ({ 
  form, 
  cryptocurrencies, 
  selectedAddress, 
  handleCurrencyChange, 
  onSubmit, 
  isLoading, 
  stockOption, 
  copyTrade,
  baseError,
  tranHash
}) => {
  console.log("Tokens", cryptocurrencies)
  console.log("Base Error", baseError)
  console.log("selected token", form.getValues("currency"))
  const { user } = useUser();
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()


  const handlePaymentOption = async(option: string) => {
    if (option === "copy_wallet"){
      await createDeposit({ 
        token_name: form.getValues().currency,
        amount: form.getValues().amount,
        token_deposit_address: selectedAddress,
        user_id: user?.id,
        full_name: user?.fullName,
      });

      // if (stockOption?.stock) {
      //   createStockPurchase({
      //     data: stockOption?.stock,
      //     user_id: user?.id,
      //     full_name: user?.fullName,
      //     stock_initial_value:stockOption.stock.total,
      //     stock_value_entered: form.getValues().amount,
      //     stock_token: form.getValues().currency,
      //     stock_quantity: stockOption?.stock?.total,
      //     stock_status: "pending",
      //     stock_token_address: selectedAddress,
      //   })
      // }

      // if (copyTrade?.copy) {
      //   createCopyTrade({ 
      //     data: copyTrade?.copy, 
      //     trade_title: copyTrade?.copy.title,
      //     user_id: user?.id, 
      //     full_name: user?.fullName,
      //     initial_investment: form.getValues().amount,
      //     trade_token: form.getValues().currency,
      //     trade_token_address: selectedAddress,
      //     trade_status: "pending"      
      //   })
      // }

      dispatch(openModal({
        modalType: "deposit",
        modalProps: { address: selectedAddress, currency: form.getValues("currency"), amount: form.getValues("amount") },
      }));
      setOpen(false)
    } else if (option === "connect_wallet") {
      if(!isConnected){
        setOpen(false)
        toast("Wallet Not Connected!", { description: "Please connect your wallet above."});
      } else if (!["Ethereum", "ETH", "Eth"].includes(form.getValues("currency"))) {
        toast("Only ETH is supported by wallet", { description: "Please use the copy wallet option for this token"});
      } else {
        form.handleSubmit(onSubmit)();
        setOpen(false)
      }
    }
  };

  console.log("is wallet connected", isConnected)

  return (
    <div className="flex h-full justify-center items-center w-full gap-6">
      <div className="p-8 grid justify-items-center">
        <h1 className="text-2xl md:text-4xl font-bold">Deposit Funds</h1>
        <p className="mb-10 text-sm md:text-base">via Crypto Wallet</p>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="w-[300px] sm:w-[350px]">
            <CardHeader>
              <CardDescription>
                Select your cryptocurrency and deposit amount.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cryptocurrency</FormLabel>
                        <Select onValueChange={handleCurrencyChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full text-start text-xs p-2 border border-appGold20">
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-appDark grid gap-2 p-2 rounded text-sm">
                            {cryptocurrencies.map((crypto) => (
                              <SelectItem key={crypto?.id} value={crypto?.value} className="hover:bg-appGold20 outline-none hover:border-none p-1 rounded">
                                {crypto?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Enter deposit amount (e.g., 0.01)" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {stockOption?.stock?.total !== 0 && Object.keys(stockOption?.stock).length > 0 && (
                    <div>
                      <FormLabel>Total Amount to Deposit</FormLabel>
                      <Input type="number" value={stockOption?.stock?.total} disabled className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Deposit the amount stated above in crypto to be able to purchase this Stock.
                      </p>
                    </div>
                  )}
                  {copyTrade?.copy?.title !== "" && Object.keys(copyTrade?.copy).length > 0 && (
                    <div>
                      <FormLabel>Plan</FormLabel>
                      {/* <Input type="text" value={copyTrade?.copy?.title} disabled className="mb-2" /> */}
                      <p className="text-sm text-muted-foreground">
                        Deposit ${copyTrade?.copy?.trade_min} in crypto to be able to purchase this Plan.
                      </p>
                    </div>
                  )}
                  <PaymentModal
                      handlePaymentOption={handlePaymentOption}
                      open={open}
                      setOpen={setOpen}
                      isLoading={isLoading}
                  />
                  {tranHash && (
                      <TransactionHash hash={tranHash} />
                  )}
                </form>
              </FormProvider>
            </CardContent>

            <p className="text-sm text-muted-foreground mx-auto text-center max-w-[280px]">
              NOTE: Processing may take 5-10 seconds after selection. Please don&#39;t close or refresh the page.
            </p>
          </Card>
        </motion.div>
      </div>
      <DepositModal />
    </div>
  );
};

export default DepositFunds;
