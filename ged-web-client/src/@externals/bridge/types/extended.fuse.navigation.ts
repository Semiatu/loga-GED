import {FuseNavigationItem} from '../../fuse/@fuse/types';

export interface ExtendedFuseNavigation extends FuseNavigationItem {
    role?: string;
    children?: ExtendedFuseNavigation[];
}
