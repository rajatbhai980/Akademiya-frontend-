import axiosClient from './axiosClient';

/** Purchase a subscription using gems. */
export const purchaseSubscription = () => axiosClient.post('/store/subscription/');
