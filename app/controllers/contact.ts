import { Request, Response } from "express";
import { sendAdminEmail } from "../utils/email";

export const contactUs = async (req, res: Response): Promise<void> => {
  try {
    const {
      "First Name": firstName,
      "Last Name": lastName,
      Email: email,
      Telephone: telephone,
      "Referred By": referredBy,
      "Referred To Lawyer": referredToLawyer,
      "Preferred Contact Method": preferredContactMethod,
      Message: message,
    } = req.body;

    if (!firstName) {
      res
        .status(400)
        .json({ success: false, message: "Please enter your firstName." });
      return;
    } else if (!lastName) {
      res
        .status(400)
        .json({ success: false, message: "Please enter your lastName." });
      return;
    } else if (!email) {
      res
        .status(400)
        .json({ success: false, message: "Please enter your email." });
      return;
    } else if (!telephone) {
      res
        .status(400)
        .json({ success: false, message: "Please enter your contact number." });
      return;
    } else if (!message) {
      res
        .status(400)
        .json({ success: false, message: "Please add a message." });
      return;
    } else if (!referredBy) {
      res
        .status(400)
        .json({ success: false, message: "Please add a referredby." });
      return;
    } else if (!preferredContactMethod) {
      res
        .status(400)
        .json({ success: false, message: "Please select a contact method." });
      return;
    }

    function validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }

    if (!validateEmail(email)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
      return;
    }
    await sendAdminEmail({
      firstName,
      lastName,
      email,
      telephone,
      referredBy,
      referredToLawyer,
      preferredContactMethod,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Your inquiry has been sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry. Please try again later.",
    });
  }
};
