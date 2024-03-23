'use client';

import { FormEvent, useRef, useState } from 'react';

import { useUIState, useActions } from 'ai/rsc';
import { UserMessage } from '../libs/assistance/react/ui/message';

import { type AI } from './action';
import { ChatScrollAnchor } from '../libs/assistance/react/chat/hooks/chat-scroll-anchor';
import Textarea from 'react-textarea-autosize';
import { useEnterSubmit } from '../libs/assistance/react/chat/hooks/use-enter-submit';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../libs/assistance/react/ui/tooltip';
import { IconArrowElbow, IconPlus } from '../libs/assistance/react/ui/icons';
import { Button } from '../libs/assistance/react/ui/button';
import { ChatList } from '../libs/assistance/react/chat/chat-list';
import { EmptyScreen } from '../libs/assistance/react/chat/empty-screen';
import { toast } from '../libs/assistance/react/ui/use-toast';
import { Flex } from '@radix-ui/themes';
export const INTRO = `I am Patrick Neiler's Clone, a replica created by Patrick himself. With my brilliant software engineering skills, reliable track record, and exceptional communication abilities, I bring a unique value to the table. Feel free to ask me anything and prepare to be impressed.`


export default function Page() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [inputValue, setInputValue] = useState('');
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Blur focus on mobile
    if (window.innerWidth < 600) {
      (e.target as HTMLFormElement)['message']?.blur();
    }

    const value = inputValue.trim();
    setInputValue('');
    if (!value) return;

    // Add user message UI
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      // Submit and get response message
      const responseMessage = await submitUserMessage(value);
      setMessages(currentMessages => [
        ...currentMessages,
        responseMessage,
      ]);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        duration: 5000,
      });
    }
  }

  const handleSubmit = async (message: string) => {
    // Add user message UI
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <UserMessage>{message}</UserMessage>,
      },
    ]);

    // Submit and get response message
    const responseMessage = await submitUserMessage(message);
    setMessages(currentMessages => [
      ...currentMessages,
      responseMessage,
    ]);
  }

  return (
    <div>
      <Flex
        align="center"
        justify="center"
        position="absolute"
        inset="0"
        style={{ overflow: 'hidden', zIndex: 1 }}
      >
        <PanelBackgroundImage id="1" width="100%" height="200%" />
      </Flex>
      {messages.length ? (
        <div className="pb-[200px] pt-4 md:pt-24 z-10 relative">
          <ChatList messages={messages} />
        </div>
      ) : (
        <>
          <div className="pb-[200px] pt-4 md:pt-8 z-10 relative">
            <EmptyScreen
              introMessage={INTRO}
              submitMessage={handleSubmit}
            />
          </div>
        </>
      )}
      <ChatScrollAnchor trackVisibility={true} />
      <div className="fixed inset-x-0 bottom-0 w-full z-20 bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <form
              ref={formRef}
              onSubmit={handleForm}
            >
              <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
                      onClick={e => {
                        e.preventDefault();
                        window.location.reload();
                      }}
                    >
                      <IconPlus />
                      <span className="sr-only">New Chat</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Chat</TooltipContent>
                </Tooltip>
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={inputValue === ''}
                      >
                        <IconArrowElbow />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
const PanelBackgroundImage = ({
  id,
  style,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & { id: string }) => (
  <svg
    width="2560"
    height="1920"
    viewBox="0 0 2560 1920"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.6, ...style }}
    {...props}
  >
    <g>
      <path
        d="M-119.809 -1055.99L859.027 -684.98C915.435 -663.6 955.626 -624.994 968.519 -579.807L1129.49 -15.6245L1860.47 -241.727C1919.02 -259.836 1985.68 -257.939 2042.09 -236.559L3020.93 134.453C3124.79 173.822 3164.97 266.777 3110.66 342.073L2850.06 703.385C2827.36 734.857 2790.34 759.666 2745.28 773.604L1467.45 1168.86L1748.58 2154.16C1758.67 2189.52 1751.28 2226.32 1727.72 2258.12L1361.75 2752.01L203.258 2312.91C146.85 2291.53 106.659 2252.92 93.7664 2207.73L-67.2076 1643.55L-798.184 1869.65C-856.73 1887.76 -923.398 1885.87 -979.806 1864.48L-2138.3 1425.38L-1787.63 925.687C-1765.05 893.507 -1727.57 868.111 -1681.77 853.942L-405.167 459.07L-686.568 -527.183C-696.491 -561.961 -689.511 -598.157 -666.811 -629.629L-406.21 -990.941C-351.902 -1066.24 -223.676 -1095.36 -119.809 -1055.99Z"
        fill={`url(#paint0_radial_37_453-${id})`}
      />
      <path
        d="M885.9 -99.2158L1864.74 271.796C1921.14 293.177 1961.34 331.783 1974.23 376.97L2135.2 941.152L2866.18 715.049C2924.72 696.94 2991.39 698.837 3047.8 720.218L4026.64 1091.23C4130.5 1130.6 4170.68 1223.55 4116.37 1298.85L3855.77 1660.16C3833.07 1691.63 3796.05 1716.44 3750.99 1730.38L2473.16 2125.63L2754.29 3110.94C2764.38 3146.29 2756.99 3183.09 2733.43 3214.9L2367.46 3708.79L1208.97 3269.68C1152.56 3248.3 1112.37 3209.7 1099.48 3164.51C816.824 2173.87 747.087 1929.46 319.141 429.593C309.218 394.815 316.198 358.619 338.898 327.147L599.499 -34.1647C653.807 -109.461 782.033 -138.585 885.9 -99.2158Z"
        fill={`url(#paint1_radial_37_453-${id})`}
      />
      <path
        d="M1597.13 169.784L2575.97 540.796C2632.38 562.177 2672.57 600.783 2685.46 645.97L2846.44 1210.15L3577.41 984.049C3635.96 965.94 3702.63 967.837 3759.03 989.218L4737.87 1360.23C4841.74 1399.6 4881.91 1492.55 4827.61 1567.85L4567 1929.16C4544.3 1960.63 4507.28 1985.44 4462.22 1999.38L3184.4 2394.63L3465.53 3379.94C3475.61 3415.29 3468.23 3452.09 3444.66 3483.9L3078.69 3977.79L1920.2 3538.68C1863.79 3517.3 1823.6 3478.7 1810.71 3433.51L1649.74 2869.33L918.759 3095.43C860.213 3113.54 793.545 3111.64 737.138 3090.26L-421.356 2651.15L-70.6875 2151.46C-48.1049 2119.28 -10.63 2093.89 35.1782 2079.72L1311.78 1684.85L1030.38 698.593C1020.45 663.815 1027.43 627.619 1050.13 596.147L1310.73 234.835C1365.04 159.539 1493.27 130.415 1597.13 169.784Z"
        fill={`url(#paint2_radial_37_453-${id})`}
      />
      <g filter={`url(#filter0_f_37_453-${id})`}>
        <path
          d="M2395.71 -658.308L3374.55 -287.296C3430.96 -265.915 3471.15 -227.309 3484.04 -182.122L3645.01 382.06L4375.99 155.958C4434.54 137.848 4501.2 139.745 4557.61 161.126L5536.45 532.138C5640.32 571.507 5680.49 664.461 5626.18 739.757L5365.58 1101.07C5342.88 1132.54 5305.86 1157.35 5260.8 1171.29L3982.97 1566.54L4264.1 2551.84C4274.19 2587.2 4266.81 2624 4243.24 2655.81L3877.27 3149.7L2718.78 2710.59C2662.37 2689.21 2622.18 2650.6 2609.29 2605.42L2448.31 2041.24L1717.34 2267.34C1658.79 2285.45 1592.12 2283.55 1535.72 2262.17L377.222 1823.06L727.891 1323.37C750.473 1291.19 787.948 1265.8 833.756 1251.63L2110.35 856.754L1828.95 -129.498C1819.03 -164.277 1826.01 -200.472 1848.71 -231.944L2109.31 -593.257C2163.62 -668.552 2291.85 -697.677 2395.71 -658.308Z"
          fill={`url(#paint3_radial_37_453-${id})`}
        />
      </g>
      <path
        d="M3059.26 767.932L3310.25 1618.16C3324.72 1667.15 3315.74 1727.88 3285.79 1783.6L2911.89 2479.3L3514.51 2558.36C3562.77 2564.69 3599.15 2596.78 3613.62 2645.77L3864.61 3496C3891.25 3586.22 3837.41 3706.98 3744.37 3765.74L3297.91 4047.66C3259.03 4072.22 3217.48 4082.97 3180.34 4078.1L2126.89 3939.89L1473.9 5154.88C1450.47 5198.48 1415.9 5235.81 1376.24 5260.35L760.412 5641.34L463.348 4635.06C448.884 4586.06 457.863 4525.33 487.81 4469.61L861.713 3773.92L259.094 3694.86C210.828 3688.53 174.448 3656.44 159.984 3607.44L-137.08 2601.17L474.823 2206.89C514.228 2181.5 556.514 2170.3 594.278 2175.25L1646.71 2313.32L2300.33 1097.17C2323.38 1054.28 2357.22 1017.43 2396.11 992.876L2842.57 710.953C2935.61 652.202 3032.62 677.712 3059.26 767.932Z"
        fill={`url(#paint4_radial_37_453-${id})`}
      />
    </g>
    <defs>
      <filter
        id={`filter0_f_37_453-${id}`}
        x="213.223"
        y="-839.851"
        width="5601.16"
        height="4153.55"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="82" result="effect1_foregroundBlur_37_453" />
      </filter>
      <radialGradient
        id={`paint0_radial_37_453-${id}`}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-804.109 -2036.8) rotate(64.9401) scale(6436.87 6304.81)"
      >
        <stop stopColor="var(--color-background)" />
        <stop offset="0.0833333" stopColor="var(--accent-7)" />
        <stop offset="0.364583" stopColor="var(--accent-5)" />
        <stop offset="0.658041" stopColor="var(--color-background)" />
        <stop offset="0.798521" stopColor="var(--accent-9)" />
        <stop offset="0.942708" stopColor="var(--color-background)" />
        <stop offset="1" stopColor="var(--color-background)" />
      </radialGradient>
      <radialGradient
        id={`paint1_radial_37_453-${id}`}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(201.6 -1080.02) rotate(64.9401) scale(6436.87 6304.81)"
      >
        <stop stopColor="var(--color-background)" />
        <stop offset="0.0833333" stopColor="var(--accent-2)" />
        <stop offset="0.333803" stopColor="var(--accent-1)" />
        <stop offset="0.658041" stopColor="var(--color-background)" />
        <stop offset="0.798521" stopColor="var(--accent-9)" />
        <stop offset="0.942708" stopColor="var(--color-background)" />
        <stop offset="1" stopColor="var(--color-background)" />
      </radialGradient>
      <radialGradient
        id={`paint2_radial_37_453-${id}`}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(912.834 -811.021) rotate(64.9401) scale(6436.87 6304.81)"
      >
        <stop stopColor="var(--color-background)" />
        <stop offset="0.140625" stopColor="var(--accent-3)" />
        <stop offset="0.333803" stopColor="var(--accent-7)" />
        <stop offset="0.658041" stopColor="var(--color-background)" />
        <stop offset="0.798521" stopColor="var(--accent-9)" />
        <stop offset="0.942708" stopColor="var(--color-background)" />
        <stop offset="1" stopColor="var(--color-background)" />
      </radialGradient>
      <radialGradient
        id={`paint3_radial_37_453-${id}`}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(1711.41 -1639.11) rotate(64.9401) scale(6436.87 6304.81)"
      >
        <stop stopColor="var(--color-background)" />
        <stop offset="0.0833333" stopColor="var(--accent-7)" />
        <stop offset="0.333803" stopColor="var(--accent-1)" />
        <stop offset="0.658041" stopColor="var(--color-background)" />
        <stop offset="0.798521" stopColor="var(--accent-9)" />
        <stop offset="0.942708" stopColor="var(--color-background)" />
        <stop offset="1" stopColor="var(--color-background)" />
      </radialGradient>
      <radialGradient
        id={`paint4_radial_37_453-${id}`}
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(3479.06 -623.459) rotate(113.028) scale(8332.26 4870.62)"
      >
        <stop stopColor="var(--color-background)" />
        <stop offset="0.0833333" stopColor="var(--accent-7)" />
        <stop offset="0.333803" stopColor="var(--accent-1)" />
        <stop offset="0.658041" stopColor="var(--color-background)" />
        <stop offset="0.798521" stopColor="var(--accent-9)" />
        <stop offset="0.942708" stopColor="var(--color-background)" />
        <stop offset="1" stopColor="var(--color-background)" />
      </radialGradient>
    </defs>
  </svg>
);