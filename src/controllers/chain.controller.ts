import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChainServices } from 'src/services/web3.service';

@Controller('api/chains')
export class ChainController {
  constructor(private readonly chainServices: ChainServices) {}

  @Get()
  getChianIdList() {
    return this.chainServices.getNetworksChainIDList();
  }

  @Get('getNetworkAssets/:chainId')
  getNetworkAssets(@Param('chainId', ParseIntPipe) chainId: number) {
    return this.chainServices.getNetworkAssets(chainId);
  }

  @Get('getNetworkNativeAsset/:chainId')
  getNetworkNativeAsset(@Param('chainId', ParseIntPipe) chainId: number) {
    return this.chainServices.getNetworkNativeAsset(chainId);
  }

  @Get('isChainListed/:chainId')
  isChainListed(@Param('chainId', ParseIntPipe) chainId: number) {
    return this.chainServices.isChainListed(chainId);
  }

  @Get('getAllAssets')
  getAllAssets() {
    return this.chainServices.getAllAssets();
  }

  @Get('isAssetListed/:assetName')
  isAssetListed(@Param('assetName') assetName: string) {
    return this.chainServices.isAssetListed(assetName);
  }
}
