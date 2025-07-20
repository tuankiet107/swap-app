// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SwapTokenAMM is Ownable {
    IERC20 public token;
    uint256 public reserveToken;
    uint256 public reserveETH;
    uint256 public constant FEE_PERCENT = 3;

    event LiquidityAdded(
        address indexed user,
        uint256 ethAmount,
        uint256 tokenAmount
    );

    event Swapped(
        address indexed user,
        address input,
        address output,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    receive() external payable {}

    function addLiquidity(uint256 tokenAmount) external payable onlyOwner {
        require(msg.value > 0, "Need ETH");
        require(tokenAmount > 0, "Need token");

        require(
            token.transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed"
        );

        reserveToken += tokenAmount;
        reserveETH += msg.value;

        emit LiquidityAdded(msg.sender, msg.value, tokenAmount);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountIn > 0, "Invalid input");
        uint256 amountInWithFee = amountIn * (1000 - FEE_PERCENT);
        return
            (amountInWithFee * reserveOut) /
            (reserveIn * 1000 + amountInWithFee);
    }

    function swapEthToToken() external payable returns (uint256 tokenOut) {
        require(msg.value > 0, "Send ETH");
        uint256 ethIn = msg.value;

        tokenOut = getAmountOut(ethIn, reserveETH, reserveToken);

        require(
            token.balanceOf(address(this)) >= tokenOut,
            "Not enough token liquidity"
        );

        reserveETH += ethIn;
        reserveToken -= tokenOut;

        token.transfer(msg.sender, tokenOut);

        emit Swapped(msg.sender, address(0), address(token), ethIn, tokenOut);
    }

    function swapTokenToEth(uint256 tokenIn) external returns (uint256 ethOut) {
        require(tokenIn > 0, "Send token");

        ethOut = getAmountOut(tokenIn, reserveToken, reserveETH);

        require(address(this).balance >= ethOut, "Not enough ETH liquidity");

        require(
            token.transferFrom(msg.sender, address(this), tokenIn),
            "Token transfer failed"
        );

        reserveToken += tokenIn;
        reserveETH -= ethOut;

        payable(msg.sender).transfer(ethOut);

        emit Swapped(msg.sender, address(token), address(0), tokenIn, ethOut);
    }

    function getReserves()
        external
        view
        returns (uint256 tokenReserve, uint256 ethReserve)
    {
        return (reserveToken, reserveETH);
    }

    function withdraw() external onlyOwner {
        token.transfer(msg.sender, token.balanceOf(address(this)));
        payable(msg.sender).transfer(address(this).balance);
    }
}
