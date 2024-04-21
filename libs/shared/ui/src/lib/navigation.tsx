'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Separator } from '@radix-ui/themes';
import NextLink from 'next/link';

import { usePathname } from 'next/navigation';

export interface NavigationMenuItem {
    title: string;
    href: string;
}

export interface NavigationMenuProps {
    items: NavigationMenuItem[];
    color?: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky";
}

export interface NavigationLinkProps {
    href: string;
    children: React.ReactNode;
    color?: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky";
}


const Link = ({ href, children, color }: NavigationLinkProps) => {
    const pathname = usePathname();
    const isActive = href === pathname;

    return (
        <NavigationMenu.Link asChild className={`px-8 relative outline-none select-none font-semibold`} active={isActive}>
            <>
                <NextLink className={`h-full flex items-center ${isActive && `border-${color}-11`}`} href={href} >
                    <span className={`${isActive && "-mb-1"}`}>{children}</span>
                </NextLink>

                <div className="absolute bottom-0 w-full h-1">
                    <Separator color={color || 'gray'} size="4" className='h-1' />
                </div>
            </>
        </NavigationMenu.Link>
    );
};

export const Navigation = ({ items, color }: NavigationMenuProps) => {
    return (
        <NavigationMenu.Root className="flex justify-center items-center h-full z-10">
            <NavigationMenu.List className="flex justify-center bg-white h-full px-4 rounded-6 list-none shadow-md m-0">
                {
                    items.map((item) => (
                        <NavigationMenu.Item className='h-14 flex items-center justify-center' key={item.href}>
                            <Link color={color} href={item.href}>{item.title}</Link>
                        </NavigationMenu.Item>
                    ))
                }

            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};

export default Navigation;
