import * as React from "react";
import logos from "../../public/assets/logo-svg.svg";
import youtube from "../../public/assets/youtube.svg";
import discord from "../../public/assets/discord.svg";
import twitter from "../../public/assets/twitter.svg";
import linkedin from "../../public/assets/linkedin.svg";
import telegram from "../../public/assets/telegram.svg";
import tiktok from "../../public/assets/tiktok.svg";
import insta from "../../public/assets/insta.svg";

import Image from "next/image";

export default function Copyright(props) {
  return (
    <div className="footer">
      <div className="footer-main">
        <div className="footer-img">
          <Image src={logos} />
        </div>
        <div className="footer-desc">
          <p>
            Enabling Smooth Cross Chain <br /> Connectivity for a Decentralized
            Future
          </p>
        </div>
        <div className="copyright-main">
          <div className="copyright">
            <p>Copyright © 2024 ARMswap. All rights reserved.</p>
          </div>
          <div className="copyright">
            <a target="_blank" href="https://x.com/armswapofficial">
              <Image src={twitter} />
            </a>
            <a target="_blank" href="https://discord.gg/a2qWWHREeY">
              <Image src={discord} />
            </a>

            <a target="_blank" href="https://www.youtube.com/@ARMswap">
              <Image src={youtube} />
            </a>

            <a target="_blank" href="https://www.linkedin.com/company/98865062">
              <Image src={linkedin} />
            </a>
            <a target="_blank" href="https://www.instagram.com/armswap/">
              <Image src={insta} />
            </a>
            <a target="_blank" href="https://t.me/arm_swap">
              <Image src={telegram} />
            </a>
            <a target="_blank" href="https://www.tiktok.com/@armswap">
              <Image src={tiktok} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
